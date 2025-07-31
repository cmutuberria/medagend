import { Module } from '@nestjs/common';
import { PrismaModule } from '@med-agend/prisma';
import { AppointmentService } from './appointments.service';
import { AppointmentResolver } from './appointments.resolver';
import { UserService } from '../users/users.service';
import { AppointmentPrismaRepository } from '../../repositories/appointments.prisma.repository';
import { UserPrismaRepository } from '../../repositories/users.prisma.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    AppointmentService,
    AppointmentResolver,
    UserService,
    {
      provide: 'AppointmentRepository',
      useClass: AppointmentPrismaRepository,
    },
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
  ],
})
export class AppointmentsModule {}
