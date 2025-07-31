import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AvailabilityService } from './availability.service';
import {
  Availability,
  CreateAvailabilityInput,
  UpdateAvailabilityInput,
} from '../../dto/availability.dto';
import { User } from '../../dto/user.dto';
import { UserService } from '../users/users.service';

@Resolver(() => Availability)
export class AvailabilityResolver {
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => Availability, {
    description: 'Crear una nueva disponibilidad',
  })
  createAvailability(
    @Args('createAvailabilityInput')
    createAvailabilityInput: CreateAvailabilityInput
  ) {
    return this.availabilityService.create(createAvailabilityInput);
  }

  @Query(() => [Availability], {
    name: 'availabilities',
    description: 'Obtener todas las disponibilidades',
  })
  findAll(): Promise<Availability[]> {
    return this.availabilityService.findAll();
  }

  @Query(() => Availability, {
    name: 'availability',
    description: 'Obtener una disponibilidad por ID',
  })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.availabilityService.findOne(id);
  }

  @Query(() => [Availability], {
    name: 'availabilitiesByProfessional',
    description: 'Obtener todas las disponibilidades de un profesional',
  })
  findByProfessionalId(
    @Args('professionalId', { type: () => ID }) professionalId: string
  ) {
    return this.availabilityService.findByProfessionalId(professionalId);
  }

  @Query(() => [Availability], {
    name: 'availabilitiesByProfessionalAndDay',
    description:
      'Obtener las disponibilidades de un profesional en un día específico',
  })
  findByProfessionalAndDay(
    @Args('professionalId', { type: () => ID }) professionalId: string,
    @Args('dayOfWeek', { type: () => Int }) dayOfWeek: number
  ) {
    return this.availabilityService.findByProfessionalAndDay(
      professionalId,
      dayOfWeek
    );
  }

  @Mutation(() => Availability, {
    description: 'Actualizar una disponibilidad',
  })
  updateAvailability(
    @Args('updateAvailabilityInput')
    updateAvailabilityInput: UpdateAvailabilityInput
  ) {
    return this.availabilityService.update(
      updateAvailabilityInput.id,
      updateAvailabilityInput
    );
  }

  @Mutation(() => Availability, { description: 'Eliminar una disponibilidad' })
  removeAvailability(@Args('id', { type: () => ID }) id: string) {
    return this.availabilityService.remove(id);
  }

  @ResolveField(() => User, { name: 'professional' })
  async getProfessional(@Parent() availability: Availability): Promise<User> {
    return this.userService.findOne(availability.professionalId);
  }
}
