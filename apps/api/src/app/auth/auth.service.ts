import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type UserRepositoryInterface } from '../../interfaces/users.repository.interface';
import { User } from '../../dto/user.dto';
import { AuthTokenPayload } from '../../dto/auth.dto';

const ACCESS_TOKEN_DURATION = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const ACCESS_TOKEN_EXPIRE_IN = '15m';
const REFRESH_TOKEN_EXPIRE_IN = '7d';

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

  async login(user: User) {
    const secret = process.env.JWT_SECRET || 'secret123';
    const { accessTokenPayload, refreshTokenPayload } =
      this.createPayloads(user);

    const accessToken = this.jwt.sign(accessTokenPayload, {
      secret,
      expiresIn: ACCESS_TOKEN_EXPIRE_IN,
    });
    const refreshToken = this.jwt.sign(refreshTokenPayload, {
      secret,
      expiresIn: REFRESH_TOKEN_EXPIRE_IN,
    });

    return { accessToken, refreshToken, user };
  }

  async refresh(refreshToken: string) {
    try {
      const { exp, iat, ...rest } = this.jwt.verify(refreshToken);
      const newPayload = {
        ...rest,
        expiresAt: new Date(Date.now() + 10 * 1000),
      };
      const newAccessToken = this.jwt.sign(newPayload, {
        secret: process.env.JWT_SECRET || 'secret123',
        expiresIn: ACCESS_TOKEN_EXPIRE_IN,
      });
      return newAccessToken;
    } catch (error) {
      throw new ConflictException('INVALID_REFRESH_TOKEN');
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

    const accessTokenPayload = {
      primaryKey: user.id,
      email: user.email,
      role: user.role,
      createdAt: now,
      expiresAt: new Date(now.getTime() + ACCESS_TOKEN_DURATION),
    };

    const refreshTokenPayload = {
      ...accessTokenPayload,
      expiresAt: new Date(now.getTime() + REFRESH_TOKEN_DURATION),
    };

    return { accessTokenPayload, refreshTokenPayload };
  }
}
