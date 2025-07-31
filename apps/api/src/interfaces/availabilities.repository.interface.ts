import {
  CreateAvailabilityInput,
  UpdateAvailabilityInput,
  Availability,
} from '../dto/availability.dto';

export interface AvailabilityRepositoryInterface {
  create(data: CreateAvailabilityInput): Promise<Availability>;
  findAll(): Promise<Availability[]>;
  findById(id: string): Promise<Availability | null>;
  update(id: string, data: UpdateAvailabilityInput): Promise<Availability>;
  remove(id: string): Promise<Availability>;
  findByProfessionalId(professionalId: string): Promise<Availability[]>;
  findByProfessionalAndDay(
    professionalId: string,
    dayOfWeek: number
  ): Promise<Availability[]>;
}
