import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import {
  Payment,
  CreatePaymentInput,
  UpdatePaymentInput,
  PaymentStatus,
  PaymentMethod,
  PaymentStatistics,
} from '../../dto/payment.dto';
import type { PaymentRepositoryInterface } from '../../interfaces/payments.repository.interface';
import type { AppointmentRepositoryInterface } from '../../interfaces/appointments.repository.interface';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepositoryInterface,
    @Inject('AppointmentRepository')
    private readonly appointmentRepository: AppointmentRepositoryInterface
  ) {}

  async create(createPaymentInput: CreatePaymentInput): Promise<Payment> {
    // Validar que el monto sea positivo
    if (createPaymentInput.amount <= 0) {
      throw new BadRequestException('El monto debe ser mayor a 0');
    }

    // Validar que la cita existe
    const appointment = await this.appointmentRepository.findById(
      createPaymentInput.appointmentId
    );
    if (!appointment) {
      throw new NotFoundException(
        `Cita con ID ${createPaymentInput.appointmentId} no encontrada`
      );
    }

    // Validar que no exista ya un pago para esta cita
    const existingPayment = await this.paymentRepository.findByAppointmentId(
      createPaymentInput.appointmentId
    );
    if (existingPayment) {
      throw new BadRequestException('Ya existe un pago para esta cita');
    }

    // Validar que el monto coincida con el precio de la cita
    if (createPaymentInput.amount !== appointment.price) {
      throw new BadRequestException(
        `El monto del pago (${createPaymentInput.amount}) debe coincidir con el precio de la cita (${appointment.price})`
      );
    }

    // Crear el pago con estado PENDING por defecto si no se especifica
    const payment = await this.paymentRepository.create({
      ...createPaymentInput,
      status: createPaymentInput.status || PaymentStatus.PENDING,
    });

    return payment;
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);

    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    return payment;
  }

  async update(
    id: string,
    updatePaymentInput: UpdatePaymentInput
  ): Promise<Payment> {
    // Verificar que el pago existe
    const existingPayment = await this.paymentRepository.findById(id);
    if (!existingPayment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    // Validar que el monto sea positivo si se está actualizando
    if (
      updatePaymentInput.amount !== undefined &&
      updatePaymentInput.amount <= 0
    ) {
      throw new BadRequestException('El monto debe ser mayor a 0');
    }

    // Validar que no se pueda cambiar el monto de un pago ya pagado
    if (
      updatePaymentInput.amount !== undefined &&
      existingPayment.status === PaymentStatus.PAID
    ) {
      throw new BadRequestException(
        'No se puede cambiar el monto de un pago ya procesado'
      );
    }

    return await this.paymentRepository.update(id, updatePaymentInput);
  }

  async remove(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    // Validar que no se pueda eliminar un pago ya procesado
    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException(
        'No se puede eliminar un pago ya procesado'
      );
    }

    return await this.paymentRepository.remove(id);
  }

  async findByAppointmentId(appointmentId: string): Promise<Payment | null> {
    return this.paymentRepository.findByAppointmentId(appointmentId);
  }

  async findByStatus(status: string): Promise<Payment[]> {
    // Validar que el status sea válido
    if (!Object.values(PaymentStatus).includes(status as PaymentStatus)) {
      throw new BadRequestException(`Estado de pago inválido: ${status}`);
    }

    return this.paymentRepository.findByStatus(status);
  }

  async findByMethod(method: string): Promise<Payment[]> {
    // Validar que el método sea válido
    if (!Object.values(PaymentMethod).includes(method as PaymentMethod)) {
      throw new BadRequestException(`Método de pago inválido: ${method}`);
    }

    return this.paymentRepository.findByMethod(method);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    // Validar que las fechas sean válidas
    if (startDate > endDate) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de fin'
      );
    }

    return this.paymentRepository.findByDateRange(startDate, endDate);
  }

  async processPayment(id: string, transactionId?: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException('El pago ya está procesado');
    }

    if (payment.status === PaymentStatus.FAILED) {
      throw new BadRequestException('No se puede procesar un pago fallido');
    }

    // Actualizar el pago como pagado
    const updatedPayment = await this.paymentRepository.update(id, {
      id,
      status: PaymentStatus.PAID,
      transactionId: transactionId || payment.transactionId,
    });

    // Marcar la cita como pagada
    await this.appointmentRepository.update(payment.appointmentId, {
      id: payment.appointmentId,
      paid: true,
    });

    return updatedPayment;
  }

  async failPayment(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException(
        'No se puede marcar como fallido un pago ya procesado'
      );
    }

    return await this.paymentRepository.update(id, {
      id,
      status: PaymentStatus.FAILED,
    });
  }

  async refundPayment(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    if (payment.status !== PaymentStatus.PAID) {
      throw new BadRequestException(
        'Solo se pueden reembolsar pagos procesados'
      );
    }

    // Actualizar el pago como reembolsado
    const updatedPayment = await this.paymentRepository.update(id, {
      id,
      status: PaymentStatus.REFUNDED,
    });

    // Marcar la cita como no pagada
    await this.appointmentRepository.update(payment.appointmentId, {
      id: payment.appointmentId,
      paid: false,
    });

    return updatedPayment;
  }

  async getPaymentStatistics(): Promise<PaymentStatistics> {
    const allPayments = await this.paymentRepository.findAll();

    const totalPayments = allPayments.length;
    const totalAmount = allPayments
      .filter((p) => p.status === PaymentStatus.PAID)
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = allPayments.filter(
      (p) => p.status === PaymentStatus.PENDING
    ).length;
    const paidPayments = allPayments.filter(
      (p) => p.status === PaymentStatus.PAID
    ).length;
    const failedPayments = allPayments.filter(
      (p) => p.status === PaymentStatus.FAILED
    ).length;
    const refundedPayments = allPayments.filter(
      (p) => p.status === PaymentStatus.REFUNDED
    ).length;

    return {
      totalPayments,
      totalAmount,
      pendingPayments,
      paidPayments,
      failedPayments,
      refundedPayments,
    };
  }
}
