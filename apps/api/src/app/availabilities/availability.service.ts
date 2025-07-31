import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import type { AvailabilityRepositoryInterface } from '../../interfaces/availabilities.repository.interface';
import {
  CreateAvailabilityInput,
  UpdateAvailabilityInput,
  Availability,
} from '../../dto/availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @Inject('AvailabilityRepository')
    private readonly availabilityRepository: AvailabilityRepositoryInterface
  ) {}

  async create(
    createAvailabilityInput: CreateAvailabilityInput
  ): Promise<Availability> {
    // Verificar que no exista una disponibilidad para el mismo profesional en el mismo día y horario
    const existingAvailabilities =
      await this.availabilityRepository.findByProfessionalAndDay(
        createAvailabilityInput.professionalId,
        createAvailabilityInput.dayOfWeek
      );

    // Verificar si hay solapamiento de horarios
    const hasOverlap = existingAvailabilities.some((existing) => {
      const newStart = createAvailabilityInput.startTime;
      const newEnd = createAvailabilityInput.endTime;
      const existingStart = existing.startTime;
      const existingEnd = existing.endTime;

      // Verificar si hay solapamiento
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });

    if (hasOverlap) {
      throw new ConflictException(
        'Ya existe una disponibilidad que se solapa con el horario especificado'
      );
    }

    return this.availabilityRepository.create(createAvailabilityInput);
  }

  async findAll(): Promise<Availability[]> {
    return this.availabilityRepository.findAll();
  }

  async findOne(id: string): Promise<Availability> {
    const availability = await this.availabilityRepository.findById(id);

    if (!availability) {
      throw new NotFoundException(`Disponibilidad con ID ${id} no encontrada`);
    }

    return availability;
  }

  async findByProfessionalId(professionalId: string): Promise<Availability[]> {
    return this.availabilityRepository.findByProfessionalId(professionalId);
  }

  async findByProfessionalAndDay(
    professionalId: string,
    dayOfWeek: number
  ): Promise<Availability[]> {
    return this.availabilityRepository.findByProfessionalAndDay(
      professionalId,
      dayOfWeek
    );
  }

  async update(
    id: string,
    updateAvailabilityInput: UpdateAvailabilityInput
  ): Promise<Availability> {
    // Si se está actualizando el día o el horario, verificar que no haya solapamientos
    if (
      updateAvailabilityInput.dayOfWeek ||
      updateAvailabilityInput.startTime ||
      updateAvailabilityInput.endTime
    ) {
      const currentAvailability = await this.availabilityRepository.findById(
        id
      );
      if (!currentAvailability) {
        throw new NotFoundException(
          `Disponibilidad con ID ${id} no encontrada`
        );
      }

      const professionalId =
        updateAvailabilityInput.professionalId ||
        currentAvailability.professionalId;
      const dayOfWeek =
        updateAvailabilityInput.dayOfWeek || currentAvailability.dayOfWeek;
      const startTime =
        updateAvailabilityInput.startTime || currentAvailability.startTime;
      const endTime =
        updateAvailabilityInput.endTime || currentAvailability.endTime;

      const existingAvailabilities =
        await this.availabilityRepository.findByProfessionalAndDay(
          professionalId,
          dayOfWeek
        );

      // Verificar si hay solapamiento con otras disponibilidades (excluyendo la actual)
      const hasOverlap = existingAvailabilities.some((existing) => {
        if (existing.id === id) return false; // Excluir la disponibilidad actual

        const existingStart = existing.startTime;
        const existingEnd = existing.endTime;

        // Verificar si hay solapamiento
        return (
          (startTime >= existingStart && startTime < existingEnd) ||
          (endTime > existingStart && endTime <= existingEnd) ||
          (startTime <= existingStart && endTime >= existingEnd)
        );
      });

      if (hasOverlap) {
        throw new ConflictException(
          'Ya existe una disponibilidad que se solapa con el horario especificado'
        );
      }
    }

    return await this.availabilityRepository.update(
      id,
      updateAvailabilityInput
    );
  }

  async remove(id: string): Promise<Availability> {
    return await this.availabilityRepository.remove(id);
  }
}
