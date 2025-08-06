import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type UserRepositoryInterface } from '../../interfaces/users.repository.interface';
import { User } from '../../dto/user.dto';
import { AuthTokenPayload } from '../../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryInterface,
    private jwt: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.login(email, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async login(user: User, res: any) {
    const secret = process.env.JWT_SECRET || 'secret123';
    const { accessTokenPayload, refreshTokenPayload } =
      this.createPayloads(user);

    const accessToken = this.jwt.sign(accessTokenPayload, {
      secret,
      expiresIn: '15m',
    });
    const refreshToken = this.jwt.sign(refreshTokenPayload, {
      secret,
      expiresIn: '7d',
    });

    res.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { accessToken, user };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken);

      const newAccessToken = this.jwt.sign({
        ...payload,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      });
      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async logout(res: any) {
    res.clearCookie('jid');
    return true;
  }

  private createPayloads(user: User): {
    accessTokenPayload: AuthTokenPayload;
    refreshTokenPayload: AuthTokenPayload;
  } {
    const now = new Date();
    const accessTokenDuration = 15 * 60; // 15 minutes
    const refreshTokenDuration = 7 * 24 * 60 * 60; // 7 days

    const accessTokenPayload = {
      primaryKey: user.id,
      email: user.email,
      role: user.role,
      createdAt: now,
      expiresAt: new Date(now.getTime() + accessTokenDuration * 1000),
    };

    const refreshTokenPayload = {
      ...accessTokenPayload,
      expiresAt: new Date(now.getTime() + refreshTokenDuration * 1000),
    };

    return { accessTokenPayload, refreshTokenPayload };
  }
}
