import { Module } from '@nestjs/common';
import { PrismaModule } from '@med-agend/prisma';
import { PaymentService } from './payments.service';
import { PaymentResolver } from './payments.resolver';
import { PaymentPrismaRepository } from '../../repositories/payments.prisma.repository';
import { AppointmentPrismaRepository } from '../../repositories/appointments.prisma.repository';
import { AppointmentService } from '../appointments/appointments.service';

@Module({
  imports: [PrismaModule],
  providers: [
    PaymentService,
    PaymentResolver,
    AppointmentService,
    {
      provide: 'PaymentRepository',
      useClass: PaymentPrismaRepository,
    },
    {
      provide: 'AppointmentRepository',
      useClass: AppointmentPrismaRepository,
    },
  ],
  exports: [PaymentService],
})
export class PaymentsModule {}
