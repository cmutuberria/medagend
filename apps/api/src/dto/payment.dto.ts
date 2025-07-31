import {
  Field,
  Float,
  ID,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import { Appointment } from './appointments.dto';
import { Payment as PrismaPayment } from '@prisma/client';
import { nullToUndefined } from '../utils/null-to-undefined';

export enum PaymentMethod {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  MANUAL = 'MANUAL',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}
registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
  description: 'Métodos de pago',
});
registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'Estados de pago',
});

@ObjectType()
export class Payment {
  @Field(() => ID)
  id!: string;

  @Field(() => Appointment, { nullable: true })
  appointment?: Appointment;

  @Field(() => String)
  appointmentId!: string;

  @Field(() => Float)
  amount!: number;

  @Field(() => PaymentMethod)
  method!: PaymentMethod;

  @Field(() => PaymentStatus)
  status!: PaymentStatus;

  @Field(() => String, { nullable: true })
  transactionId?: string;

  @Field(() => Date)
  createdAt!: Date;
}

@InputType()
export class CreatePaymentInput extends OmitType(
  Payment,
  ['id', 'createdAt', 'appointment'] as const,
  InputType
) {}

@InputType()
export class UpdatePaymentInput extends PartialType(CreatePaymentInput) {
  @Field(() => ID)
  id!: string;
}

@ObjectType()
export class PaymentStatistics {
  @Field(() => Number)
  totalPayments!: number;

  @Field(() => Float)
  totalAmount!: number;

  @Field(() => Number)
  pendingPayments!: number;

  @Field(() => Number)
  paidPayments!: number;

  @Field(() => Number)
  failedPayments!: number;

  @Field(() => Number)
  refundedPayments!: number;
}

export function convertPrismaToDto(payment: PrismaPayment): Payment {
  return {
    ...payment,
    method: PaymentMethod[payment.method],
    status: PaymentStatus[payment.status],
    transactionId: nullToUndefined(payment.transactionId),
    appointment: undefined,
  };
}
