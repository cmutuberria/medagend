import { PrismaService } from '@med-agend/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  convertPrismaToDto,
  CreateAvailabilityInput,
  UpdateAvailabilityInput,
  Availability,
} from '../dto/availability.dto';
import type { AvailabilityRepositoryInterface } from '../interfaces/availabilities.repository.interface';

@Injectable()
export class AvailabilityPrismaRepository
  implements AvailabilityRepositoryInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAvailabilityInput): Promise<Availability> {
    const availability = await this.prisma.availability.create({
      data,
      include: {
        professional: true,
      },
    });
    return convertPrismaToDto(availability);
  }

  async findAll(): Promise<Availability[]> {
    const availabilities = await this.prisma.availability.findMany({
      include: {
        professional: true,
      },
    });
    return availabilities.map(convertPrismaToDto);
  }

  async findById(id: string): Promise<Availability | null> {
    const availability = await this.prisma.availability.findUnique({
      where: { id },
      include: {
        professional: true,
      },
    });
    return availability ? convertPrismaToDto(availability) : null;
  }

  async update(
    id: string,
    data: UpdateAvailabilityInput
  ): Promise<Availability> {
    try {
      const availability = await this.prisma.availability.update({
        where: { id },
        data,
        include: {
          professional: true,
        },
      });
      return convertPrismaToDto(availability);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Disponibilidad con ID ${id} no encontrada`
        );
      }
      throw error;
    }
  }

  async findByProfessionalId(professionalId: string): Promise<Availability[]> {
    const availabilities = await this.prisma.availability.findMany({
      where: { professionalId },
      include: {
        professional: true,
      },
    });
    return availabilities.map(convertPrismaToDto);
  }

  async findByProfessionalAndDay(
    professionalId: string,
    dayOfWeek: number
  ): Promise<Availability[]> {
    const availabilities = await this.prisma.availability.findMany({
      where: {
        professionalId,
        dayOfWeek,
      },
      include: {
        professional: true,
      },
    });
    return availabilities.map(convertPrismaToDto);
  }

  async remove(id: string): Promise<Availability> {
    try {
      const availability = await this.prisma.availability.delete({
        where: { id },
        include: {
          professional: true,
        },
      });
      return convertPrismaToDto(availability);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Disponibilidad con ID ${id} no encontrada`
        );
      }
      throw error;
    }
  }
}
