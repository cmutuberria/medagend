import { useState } from 'react';
import { appointmentClient } from '../client/appointment.client';
import { Appointment } from '../models/appointment.model';

interface AppointmentContextType {
  appointments: Appointment[] | null;
  loadingAppointments: boolean;
  findAppointmentsByProfessionalAndDay: (
    professionalId: string,
    date: Date
  ) => Promise<void>;
}

export const useAppointments = (): AppointmentContextType => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const findAppointmentsByProfessionalAndDay = async (
    professionalId: string,
    date: Date
  ) => {
    setLoadingAppointments(true);
    const appointments =
      await appointmentClient.findAppointmentsByProfessionalAndDay(
        professionalId,
        date
      );
    setAppointments(appointments);
    setLoadingAppointments(false);
  };

  return {
    appointments,
    loadingAppointments,
    findAppointmentsByProfessionalAndDay,
  };
};
