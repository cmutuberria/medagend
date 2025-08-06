import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '@med-agend/prisma';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { UserPrismaRepository } from '../../repositories/users.prisma.repository';
import { UserService } from '../users/users.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret123', //debe ser el mismo secreto que se utilice al firmar el token
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    UserService,
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
  ],
})
export class AuthModule {}
