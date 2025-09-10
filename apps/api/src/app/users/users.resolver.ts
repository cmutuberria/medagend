import { UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CreateUserInput, UpdateUserInput, User } from '../../dto/user.dto';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UserService } from './users.service';
import { AvailabilityService } from '../availabilities/availability.service';
import { Availability } from '../../dto/availability.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly availabilityService: AvailabilityService
  ) {}

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
    name: 'professionalsByQuery',
    description: 'Obtener todos los profesionales',
  })
  findProfessionalsByQuery(
    @Args('name', { nullable: true }) name?: string,
    @Args('specialty', { type: () => [String], nullable: true })
    specialty?: string[]
  ) {
    console.log({ name, specialty });
    return this.userService.findProfessionalsByQuery(name, specialty);
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

  // @ResolveField(() => [Availability], { name: 'availabilities' })
  // async getAvailabilities(@Parent() user: User): Promise<Availability[]> {
  //   return this.availabilityService.findByProfessionalId(user.id);
  // }
}
