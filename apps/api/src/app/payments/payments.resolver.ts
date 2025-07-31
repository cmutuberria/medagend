import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PaymentService } from './payments.service';
import {
  Payment,
  CreatePaymentInput,
  UpdatePaymentInput,
  PaymentStatus,
  PaymentMethod,
  PaymentStatistics,
} from '../../dto/payment.dto';
import { Appointment } from '../../dto/appointments.dto';
import { AppointmentService } from '../appointments/appointments.service';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly appointmentService: AppointmentService
  ) {}

  @Mutation(() => Payment)
  createPayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput
  ): Promise<Payment> {
    return this.paymentService.create(createPaymentInput);
  }

  @Query(() => [Payment], { name: 'payments' })
  findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Query(() => Payment, { name: 'payment' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @Mutation(() => Payment)
  updatePayment(
    @Args('updatePaymentInput') updatePaymentInput: UpdatePaymentInput
  ): Promise<Payment> {
    return this.paymentService.update(
      updatePaymentInput.id,
      updatePaymentInput
    );
  }

  @Mutation(() => Payment)
  removePayment(
    @Args('id', { type: () => String }) id: string
  ): Promise<Payment> {
    return this.paymentService.remove(id);
  }

  @Query(() => Payment, { name: 'paymentByAppointment', nullable: true })
  findByAppointmentId(
    @Args('appointmentId', { type: () => String }) appointmentId: string
  ): Promise<Payment | null> {
    return this.paymentService.findByAppointmentId(appointmentId);
  }

  @Query(() => [Payment], { name: 'paymentsByStatus' })
  findByStatus(
    @Args('status', { type: () => String }) status: string
  ): Promise<Payment[]> {
    return this.paymentService.findByStatus(status);
  }

  @Query(() => [Payment], { name: 'paymentsByMethod' })
  findByMethod(
    @Args('method', { type: () => String }) method: string
  ): Promise<Payment[]> {
    return this.paymentService.findByMethod(method);
  }

  @Query(() => [Payment], { name: 'paymentsByDateRange' })
  findByDateRange(
    @Args('startDate', { type: () => Date }) startDate: Date,
    @Args('endDate', { type: () => Date }) endDate: Date
  ): Promise<Payment[]> {
    return this.paymentService.findByDateRange(startDate, endDate);
  }

  @Mutation(() => Payment)
  processPayment(
    @Args('id', { type: () => String }) id: string,
    @Args('transactionId', { type: () => String, nullable: true })
    transactionId?: string
  ): Promise<Payment> {
    return this.paymentService.processPayment(id, transactionId);
  }

  @Mutation(() => Payment)
  failPayment(
    @Args('id', { type: () => String }) id: string
  ): Promise<Payment> {
    return this.paymentService.failPayment(id);
  }

  @Mutation(() => Payment)
  refundPayment(
    @Args('id', { type: () => String }) id: string
  ): Promise<Payment> {
    return this.paymentService.refundPayment(id);
  }

  @Query(() => PaymentStatistics, { name: 'paymentStatistics' })
  async getPaymentStatistics(): Promise<PaymentStatistics> {
    return this.paymentService.getPaymentStatistics();
  }

  // Resolvers para enums
  @Query(() => [String], { name: 'paymentStatuses' })
  getPaymentStatuses(): string[] {
    return Object.values(PaymentStatus);
  }

  @Query(() => [String], { name: 'paymentMethods' })
  getPaymentMethods(): string[] {
    return Object.values(PaymentMethod);
  }

  // Resolver de campo para obtener la cita relacionada
  @ResolveField(() => Appointment, { name: 'appointment' })
  async getAppointment(
    @Parent() payment: Payment
  ): Promise<Appointment | undefined> {
    return this.appointmentService.findOne(payment.appointmentId);
  }
}
