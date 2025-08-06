import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { User, UserRole } from '../../dto/user.dto';
import { AuthTokenPayload } from '../../dto/auth.dto';
import { UserService } from '../users/users.service';
import { Roles, RolesGuard } from './roles.guard';

@Resolver()
export class AuthResolver {
  constructor(private auth: AuthService, private userService: UserService) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() ctx: any
  ) {
    const user = await this.auth.validateUser(email, password);
    const { accessToken } = await this.auth.login(user, ctx.res);
    return accessToken;
  }

  @Mutation(() => String)
  async refresh(@Context() ctx: any) {
    const token = ctx.req.cookies['jid'];
    const { accessToken } = await this.auth.refresh(token);
    return accessToken;
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: any) {
    return this.auth.logout(ctx.res);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles(UserRole.PATIENT)
  async me(@CurrentUser() userPayload: AuthTokenPayload) {
    const user = await this.userService.findOne(userPayload.primaryKey);
    return user;
  }
}
