import {
  Payment,
  CreatePaymentInput,
  UpdatePaymentInput,
} from '../dto/payment.dto';

export interface PaymentRepositoryInterface {
  create(createPaymentInput: CreatePaymentInput): Promise<Payment>;
  findAll(): Promise<Payment[]>;
  findById(id: string): Promise<Payment | null>;
  update(id: string, updatePaymentInput: UpdatePaymentInput): Promise<Payment>;
  remove(id: string): Promise<Payment>;
  findByAppointmentId(appointmentId: string): Promise<Payment | null>;
  findByStatus(status: string): Promise<Payment[]>;
  findByMethod(method: string): Promise<Payment[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Payment[]>;
}
