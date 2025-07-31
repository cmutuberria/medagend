import { Injectable } from '@nestjs/common';
import { PrismaService } from '@med-agend/prisma';
import { PaymentRepositoryInterface } from '../interfaces/payments.repository.interface';
import {
  Payment,
  CreatePaymentInput,
  UpdatePaymentInput,
} from '../dto/payment.dto';
import { convertPrismaToDto } from '../dto/payment.dto';

@Injectable()
export class PaymentPrismaRepository implements PaymentRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentInput: CreatePaymentInput): Promise<Payment> {
    const payment = await this.prisma.payment.create({
      data: {
        appointmentId: createPaymentInput.appointmentId,
        amount: createPaymentInput.amount,
        method: createPaymentInput.method,
        status: createPaymentInput.status,
        transactionId: createPaymentInput.transactionId,
      },
    });

    return convertPrismaToDto(payment);
  }

  async findAll(): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return payments.map(convertPrismaToDto);
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    return payment ? convertPrismaToDto(payment) : null;
  }

  async update(
    id: string,
    updatePaymentInput: UpdatePaymentInput
  ): Promise<Payment> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: {
        ...(updatePaymentInput.amount !== undefined && {
          amount: updatePaymentInput.amount,
        }),
        ...(updatePaymentInput.method !== undefined && {
          method: updatePaymentInput.method,
        }),
        ...(updatePaymentInput.status !== undefined && {
          status: updatePaymentInput.status,
        }),
        ...(updatePaymentInput.transactionId !== undefined && {
          transactionId: updatePaymentInput.transactionId,
        }),
      },
    });

    return convertPrismaToDto(payment);
  }

  async remove(id: string): Promise<Payment> {
    const payment = await this.prisma.payment.delete({
      where: { id },
    });

    return convertPrismaToDto(payment);
  }

  async findByAppointmentId(appointmentId: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { appointmentId },
    });

    return payment ? convertPrismaToDto(payment) : null;
  }

  async findByStatus(status: string): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: { status: status as any },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map(convertPrismaToDto);
  }

  async findByMethod(method: string): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: { method: method as any },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map(convertPrismaToDto);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map(convertPrismaToDto);
  }
}
