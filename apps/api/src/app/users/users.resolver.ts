import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserService } from './users.service';
import { User, CreateUserInput, UpdateUserInput } from '../../dto/user.dto';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthTokenPayload } from '../../dto/auth.dto';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, { description: 'Crear un nuevo usuario' })
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], {
    name: 'users',
    description: 'Obtener todos los usuarios',
  })
  @UseGuards(GqlAuthGuard)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user', description: 'Obtener un usuario por ID' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.userService.findOne(id);
  }

  @Query(() => User, {
    name: 'userByEmail',
    description: 'Obtener un usuario por email',
  })
  findByEmail(@Args('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Query(() => [User], {
    name: 'professionals',
    description: 'Obtener todos los profesionales',
  })
  findProfessionals() {
    return this.userService.findProfessionals();
  }

  @Query(() => [User], {
    name: 'patients',
    description: 'Obtener todos los pacientes',
  })
  findPatients() {
    return this.userService.findPatients();
  }

  @Mutation(() => User, { description: 'Actualizar un usuario' })
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User, { description: 'Eliminar un usuario' })
  removeUser(@Args('id', { type: () => ID }) id: string) {
    return this.userService.remove(id);
  }
}
