import { Module } from '@nestjs/common';
import { PrismaModule } from '@med-agend/prisma';
import { AvailabilityPrismaRepository } from '../../repositories/availabilities.prisma.repository';
import { AvailabilityService } from './availability.service';
import { AvailabilityResolver } from './availability.resolver';
import { UserService } from '../users/users.service';
import { UserPrismaRepository } from '../../repositories/users.prisma.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    AvailabilityService,
    AvailabilityResolver,
    UserService,
    {
      provide: 'AvailabilityRepository',
      useClass: AvailabilityPrismaRepository,
    },
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
  ],
})
export class AvailabilityModule {}
