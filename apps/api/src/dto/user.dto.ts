import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  InputType,
  PartialType,
  OmitType,
} from '@nestjs/graphql';
import { User as PrismaUser } from '@prisma/client';
import { nullToUndefined } from '../utils/null-to-undefined';
import { Availability } from './availability.dto';

export enum UserRole {
  PATIENT = 'PATIENT',
  PROFESSIONAL = 'PROFESSIONAL',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Roles de usuario en el sistema',
});

export enum Specialty {
  CARDIOLOGY = 'CARDIOLOGY',
  DERMATOLOGY = 'DERMATOLOGY',
  ENDOCRINOLOGY = 'ENDOCRINOLOGY',
  GASTROENTEROLOGY = 'GASTROENTEROLOGY',
  GYNECOLOGY = 'GYNECOLOGY',
  MEDICINE = 'MEDICINE',
  NEUROLOGY = 'NEUROLOGY',
  OPHTHALMOLOGY = 'OPHTHALMOLOGY',
  PEDIATRICS = 'PEDIATRICS',
  PSYCHIATRY = 'PSYCHIATRY',
  RADIOLOGY = 'RADIOLOGY',
  TRAUMATOLOGY = 'TRAUMATOLOGY',
}

registerEnumType(Specialty, {
  name: 'Specialty',
  description: 'Especialidades de usuario en el sistema',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  licenseNumber?: string;

  @Field({ nullable: true })
  specialty?: Specialty;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => [Availability], { nullable: true })
  availabilities?: Availability[];
}

@InputType()
export class CreateUserInput extends OmitType(
  User,
  ['id', 'createdAt', 'updatedAt', 'availabilities'] as const,
  InputType
) {
  @Field()
  password!: string;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  id!: string;
}
export function convertPrismaToDto(user: PrismaUser): User {
  return {
    ...user,
    role: UserRole[user.role],
    avatarUrl: nullToUndefined(user.avatarUrl),
    phone: nullToUndefined(user.phone),
    bio: nullToUndefined(user.bio),
    licenseNumber: nullToUndefined(user.licenseNumber),
    specialty:
      user.specialty &&
      Object.values(Specialty).includes(user.specialty as Specialty)
        ? (user.specialty as Specialty)
        : undefined,
  };
}
