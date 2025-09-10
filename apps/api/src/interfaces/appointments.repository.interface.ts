import {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from '../dto/appointments.dto';

export interface AppointmentRepositoryInterface {
  create(data: CreateAppointmentInput): Promise<Appointment>;
  findAll(): Promise<Appointment[]>;
  findById(id: string): Promise<Appointment | null>;
  update(id: string, data: UpdateAppointmentInput): Promise<Appointment>;
  remove(id: string): Promise<Appointment>;
  findByPatientId(patientId: string): Promise<Appointment[]>;
  findByProfessionalId(professionalId: string): Promise<Appointment[]>;
  findByProfessionalIdAndDay(
    professionalId: string,
    date: Date
  ): Promise<Appointment[]>;
  findByStatus(status: string): Promise<Appointment[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]>;
}
