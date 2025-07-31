import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  InputType,
  PartialType,
  OmitType,
  Int,
  Float,
} from '@nestjs/graphql';
import { Appointment as PrismaAppointment } from '@prisma/client';
import { nullToUndefined } from '../utils/null-to-undefined';
import { User } from './user.dto';
import { Payment } from './payment.dto';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
}

registerEnumType(AppointmentStatus, {
  name: 'AppointmentStatus',
  description: 'Estados de la cita',
});

@ObjectType()
export class Appointment {
  @Field(() => ID)
  id!: string;

  @Field(() => User, { nullable: true })
  patient?: User;

  @Field(() => String)
  patientId!: string;

  @Field(() => User, { nullable: true })
  professional?: User;

  @Field(() => String)
  professionalId!: string;

  @Field(() => Date)
  date!: Date;

  @Field(() => Int)
  durationMin!: number;

  @Field(() => AppointmentStatus)
  status!: AppointmentStatus;

  @Field(() => Float)
  price!: number;

  @Field(() => Boolean)
  paid!: boolean;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => Payment, { nullable: true })
  payment?: Payment;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@InputType()
export class CreateAppointmentInput extends OmitType(
  Appointment,
  [
    'id',
    'createdAt',
    'updatedAt',
    'patient',
    'professional',
    'payment',
  ] as const,
  InputType
) {}

@InputType()
export class UpdateAppointmentInput extends PartialType(
  CreateAppointmentInput
) {
  @Field(() => ID)
  id!: string;
}

// Función para convertir datos de Prisma al DTO
export function convertPrismaToDto(
  prismaAppointment: PrismaAppointment
): Appointment {
  return {
    ...prismaAppointment,
    status: AppointmentStatus[prismaAppointment.status],
    notes: nullToUndefined(prismaAppointment.notes),
  };
}
