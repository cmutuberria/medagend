import { PrismaService } from '@med-agend/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  convertPrismaToDto,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  Appointment,
} from '../dto/appointments.dto';
import { AppointmentRepositoryInterface } from '../interfaces/appointments.repository.interface';

@Injectable()
export class AppointmentPrismaRepository
  implements AppointmentRepositoryInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAppointmentInput): Promise<Appointment> {
    const appointment = await this.prisma.appointment.create({ data });
    return convertPrismaToDto(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      include: {
        patient: true,
        professional: true,
      },
    });
    return appointments.map(convertPrismaToDto);
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        professional: true,
      },
    });
    return appointment ? convertPrismaToDto(appointment) : null;
  }

  async update(id: string, data: UpdateAppointmentInput): Promise<Appointment> {
    try {
      const appointment = await this.prisma.appointment.update({
        where: { id },
        data,
        include: {
          patient: true,
          professional: true,
        },
      });
      return convertPrismaToDto(appointment);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Cita con ID ${id} no encontrada`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Appointment> {
    try {
      const appointment = await this.prisma.appointment.delete({
        where: { id },
        include: {
          patient: true,
          professional: true,
        },
      });
      return convertPrismaToDto(appointment);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Cita con ID ${id} no encontrada`);
      }
      throw error;
    }
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId },
      include: {
        patient: true,
        professional: true,
      },
      orderBy: { date: 'desc' },
    });
    return appointments.map(convertPrismaToDto);
  }

  async findByProfessionalId(professionalId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { professionalId },
      include: {
        patient: true,
        professional: true,
      },
      orderBy: { date: 'desc' },
    });
    return appointments.map(convertPrismaToDto);
  }

  async findByStatus(status: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { status: status as any },
      include: {
        patient: true,
        professional: true,
      },
      orderBy: { date: 'desc' },
    });
    return appointments.map(convertPrismaToDto);
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        patient: true,
        professional: true,
      },
      orderBy: { date: 'asc' },
    });
    return appointments.map(convertPrismaToDto);
  }
}
