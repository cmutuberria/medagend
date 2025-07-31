import {
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { User } from './user.dto';
import { Availability as PrismaAvailability } from '@prisma/client';

@ObjectType()
export class Availability {
  @Field(() => ID)
  id!: string;

  @Field(() => User, { nullable: true })
  professional?: User;

  @Field(() => String)
  professionalId!: string;

  @Field(() => Int)
  dayOfWeek!: number;

  @Field(() => String)
  startTime!: string;

  @Field(() => String)
  endTime!: string;
}

@InputType()
export class CreateAvailabilityInput extends OmitType(
  Availability,
  ['id', 'professional'] as const,
  InputType
) {}

@InputType()
export class UpdateAvailabilityInput extends PartialType(
  CreateAvailabilityInput
) {
  @Field(() => ID)
  id!: string;
}

export function convertPrismaToDto(
  availability: PrismaAvailability
): Availability {
  return {
    ...availability,
    professional: undefined,
  };
}
