import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthLoginInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class AuthTokenPayload {
  @Field()
  primaryKey!: string;

  @Field()
  email!: string;

  @Field()
  role!: string;

  @Field()
  createdAt!: Date;

  @Field()
  expiresAt!: Date;
}
