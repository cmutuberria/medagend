import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthTokenPayload } from '../../dto/auth.dto';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { GqlAuthGuard } from './gql-auth.guard';
import { RolesGuard } from './roles.guard';
import { User } from '../../dto/user.dto';

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
    const { accessToken, refreshToken } = await this.auth.login(user);
    ctx.res.cookie('jid', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/graphql',
    });
    return accessToken;
  }

  @Mutation(() => String)
  async refresh(@Context() ctx: any) {
    const token = ctx.req.cookies['jid'];
    console.log('Refreshing token from cookie', token);
    const accessToken = await this.auth.refresh(token);
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
