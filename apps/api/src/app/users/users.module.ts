import { Module } from '@nestjs/common';
import { PrismaModule } from '@med-agend/prisma';
import { UserPrismaRepository } from '../../repositories/users.prisma.repository';
import { UserService } from './users.service';
import { UserResolver } from './users.resolver';
import { AvailabilityService } from '../availabilities/availability.service';
import { AvailabilityPrismaRepository } from '../../repositories/availabilities.prisma.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    UserService,
    UserResolver,
    AvailabilityService,
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
    {
      provide: 'AvailabilityRepository',
      useClass: AvailabilityPrismaRepository,
    },
  ],
})
export class UsersModule {}
