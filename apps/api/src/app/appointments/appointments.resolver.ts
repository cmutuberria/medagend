import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AppointmentService } from './appointments.service';
import {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from '../../dto/appointments.dto';
import { User } from '../../dto/user.dto';
import { UserService } from '../users/users.service';

@Resolver(() => Appointment)
export class AppointmentResolver {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => Appointment)
  createAppointment(
    @Args('createAppointmentInput')
    createAppointmentInput: CreateAppointmentInput
  ) {
    return this.appointmentService.create(createAppointmentInput);
  }

  @Query(() => [Appointment], { name: 'appointments' })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Query(() => Appointment, { name: 'appointment' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.appointmentService.findOne(id);
  }

  @Mutation(() => Appointment)
  updateAppointment(
    @Args('updateAppointmentInput')
    updateAppointmentInput: UpdateAppointmentInput
  ) {
    return this.appointmentService.update(
      updateAppointmentInput.id,
      updateAppointmentInput
    );
  }

  @Mutation(() => Appointment)
  removeAppointment(@Args('id', { type: () => ID }) id: string) {
    return this.appointmentService.remove(id);
  }

  @Query(() => [Appointment], { name: 'appointmentsByPatient' })
  findByPatientId(@Args('patientId', { type: () => ID }) patientId: string) {
    return this.appointmentService.findByPatientId(patientId);
  }

  @Query(() => [Appointment], { name: 'appointmentsByProfessional' })
  findByProfessionalId(
    @Args('professionalId', { type: () => ID }) professionalId: string
  ) {
    return this.appointmentService.findByProfessionalId(professionalId);
  }

  @Query(() => [Appointment], { name: 'appointmentsByStatus' })
  findByStatus(@Args('status', { type: () => String }) status: string) {
    return this.appointmentService.findByStatus(status);
  }

  @Query(() => [Appointment], { name: 'appointmentsByDateRange' })
  findByDateRange(
    @Args('startDate', { type: () => Date }) startDate: Date,
    @Args('endDate', { type: () => Date }) endDate: Date
  ) {
    return this.appointmentService.findByDateRange(startDate, endDate);
  }

  @Mutation(() => Appointment)
  confirmAppointment(@Args('id', { type: () => ID }) id: string) {
    return this.appointmentService.confirmAppointment(id);
  }

  @Mutation(() => Appointment)
  cancelAppointment(@Args('id', { type: () => ID }) id: string) {
    return this.appointmentService.cancelAppointment(id);
  }

  @Mutation(() => Appointment)
  completeAppointment(@Args('id', { type: () => ID }) id: string) {
    return this.appointmentService.completeAppointment(id);
  }

  @Mutation(() => Appointment)
  markAppointmentAsPaid(@Args('id', { type: () => ID }) id: string) {
    return this.appointmentService.markAsPaid(id);
  }
  // Field resolver para cargar los datos del paciente
  @ResolveField(() => User, { name: 'patient' })
  async getPatient(@Parent() appointment: Appointment): Promise<User> {
    return this.userService.findOne(appointment.patientId);
  }

  // Field resolver para cargar los datos del profesional
  @ResolveField(() => User, { name: 'professional' })
  async getProfessional(@Parent() appointment: Appointment): Promise<User> {
    return this.userService.findOne(appointment.professionalId);
  }
}
