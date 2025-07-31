import { Module } from '@nestjs/common';
import { PrismaModule } from '@med-agend/prisma';
import { UserPrismaRepository } from '../../repositories/users.prisma.repository';
import { UserService } from './users.service';
import { UserResolver } from './users.resolver';

@Module({
  imports: [PrismaModule],
  providers: [
    UserService,
    UserResolver,
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
  ],
})
export class UsersModule {}
