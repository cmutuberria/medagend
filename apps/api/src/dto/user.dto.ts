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

export enum UserRole {
  PATIENT = 'PATIENT',
  PROFESSIONAL = 'PROFESSIONAL',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Roles de usuario en el sistema',
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
  specialty?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class CreateUserInput extends OmitType(
  User,
  ['id', 'createdAt', 'updatedAt'] as const,
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
    specialty: nullToUndefined(user.specialty),
  };
}
