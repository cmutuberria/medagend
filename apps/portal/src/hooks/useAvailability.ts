import { useState } from 'react';
import { availabilityClient } from '../client/availability.client';
import { Availability } from '../models/availability.model';

interface availabilityContextType {
  availabilities: Availability[] | null;
  loadingAvailabilities: boolean;
  findAvailabilitiesByProfessionalAndDay: (
    professionalId: string,
    dayOfWeek: number
  ) => Promise<void>;
}

export const useAvailabilities = (): availabilityContextType => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loadingAvailabilities, setLoadingAvailabilities] = useState(false);

  const findAvailabilitiesByProfessionalAndDay = async (
    professionalId: string,
    dayOfWeek: number
  ) => {
    setLoadingAvailabilities(true);
    const availabilities =
      await availabilityClient.findAvailabilitiesByProfessionalAndDay(
        professionalId,
        dayOfWeek
      );
    setAvailabilities(availabilities);
    setLoadingAvailabilities(false);
  };

  return {
    availabilities,
    loadingAvailabilities,
    findAvailabilitiesByProfessionalAndDay,
  };
};
