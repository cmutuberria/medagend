import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentStatus,
} from '../../dto/appointments.dto';
import type { AppointmentRepositoryInterface } from '../../interfaces/appointments.repository.interface';

@Injectable()
export class AppointmentService {
  constructor(
    @Inject('AppointmentRepository')
    private readonly appointmentRepository: AppointmentRepositoryInterface
  ) {}

  async create(
    createAppointmentInput: CreateAppointmentInput
  ): Promise<Appointment> {
    // Validar que la fecha no sea en el pasado
    if (new Date(createAppointmentInput.date) < new Date()) {
      throw new BadRequestException('No se puede crear una cita en el pasado');
    }

    // Validar que la duración sea positiva
    if (createAppointmentInput.durationMin <= 0) {
      throw new BadRequestException('La duración debe ser mayor a 0 minutos');
    }

    // Validar que el precio sea positivo
    if (createAppointmentInput.price < 0) {
      throw new BadRequestException('El precio no puede ser negativo');
    }

    // Crear la cita con estado PENDING por defecto
    const appointment = await this.appointmentRepository.create({
      ...createAppointmentInput,
      status: AppointmentStatus.PENDING,
      paid: false,
    });

    return appointment;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.findAll();
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);

    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    return appointment;
  }

  async update(
    id: string,
    updateAppointmentInput: UpdateAppointmentInput
  ): Promise<Appointment> {
    // Verificar que la cita existe
    const existingAppointment = await this.appointmentRepository.findById(id);
    if (!existingAppointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    // Validar que no se pueda cambiar la fecha de una cita confirmada o completada
    if (
      updateAppointmentInput.date &&
      (existingAppointment.status === AppointmentStatus.CONFIRMED ||
        existingAppointment.status === AppointmentStatus.COMPLETED)
    ) {
      throw new BadRequestException(
        'No se puede cambiar la fecha de una cita confirmada o completada'
      );
    }

    // Validar que la nueva fecha no sea en el pasado
    if (
      updateAppointmentInput.date &&
      new Date(updateAppointmentInput.date) < new Date()
    ) {
      throw new BadRequestException(
        'No se puede programar una cita en el pasado'
      );
    }

    // Validar que la duración sea positiva
    if (
      updateAppointmentInput.durationMin &&
      updateAppointmentInput.durationMin <= 0
    ) {
      throw new BadRequestException('La duración debe ser mayor a 0 minutos');
    }

    // Validar que el precio sea positivo
    if (updateAppointmentInput.price && updateAppointmentInput.price < 0) {
      throw new BadRequestException('El precio no puede ser negativo');
    }

    return await this.appointmentRepository.update(id, updateAppointmentInput);
  }

  async remove(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    // Validar que no se pueda cancelar una cita completada
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('No se puede eliminar una cita completada');
    }

    return await this.appointmentRepository.remove(id);
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByPatientId(patientId);
  }

  async findByProfessionalId(professionalId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByProfessionalId(professionalId);
  }
  async findByProfessionalIdAndDay(
    professionalId: string,
    date: Date
  ): Promise<Appointment[]> {
    return this.appointmentRepository.findByProfessionalIdAndDay(
      professionalId,
      date
    );
  }

  async findByStatus(status: string): Promise<Appointment[]> {
    // Validar que el status sea válido
    if (
      !Object.values(AppointmentStatus).includes(status as AppointmentStatus)
    ) {
      throw new BadRequestException(`Estado de cita inválido: ${status}`);
    }

    return this.appointmentRepository.findByStatus(status);
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Appointment[]> {
    // Validar que las fechas sean válidas
    if (startDate > endDate) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de fin'
      );
    }

    return this.appointmentRepository.findByDateRange(startDate, endDate);
  }

  async confirmAppointment(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException(
        'Solo se pueden confirmar citas pendientes'
      );
    }

    return await this.appointmentRepository.update(id, {
      id,
      status: AppointmentStatus.CONFIRMED,
    });
  }

  async cancelAppointment(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('No se puede cancelar una cita completada');
    }

    if (appointment.status === AppointmentStatus.CANCELED) {
      throw new BadRequestException('La cita ya está cancelada');
    }

    return await this.appointmentRepository.update(id, {
      id,
      status: AppointmentStatus.CANCELED,
    });
  }

  async completeAppointment(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    if (appointment.status !== AppointmentStatus.CONFIRMED) {
      throw new BadRequestException(
        'Solo se pueden completar citas confirmadas'
      );
    }

    return await this.appointmentRepository.update(id, {
      id,
      status: AppointmentStatus.COMPLETED,
    });
  }

  async markAsPaid(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    if (appointment.paid) {
      throw new BadRequestException('La cita ya está marcada como pagada');
    }

    return await this.appointmentRepository.update(id, {
      id,
      paid: true,
    });
  }
}
