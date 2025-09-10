import { gql } from '@apollo/client';
import { client } from '../apollo.client';

const FIND_APPOINTMENTS_BY_PROFESSIONAL_AND_DAY_QUERY = gql`
  query findByProfessionalIdAndDay($professionalId: ID!, $date: DateTime!) {
    appointmentsByProfessionalAndDay(
      professionalId: $professionalId
      date: $date
    ) {
      id
      patientId
      professionalId
      date
      time
      durationMin
      status
      price
      paid
      notes
    }
  }
`;

export const appointmentClient = {
  findAppointmentsByProfessionalAndDay: async (
    professionalId: string,
    date: Date
  ) => {
    console.log(
      'FIND_APPOINTMENTS_BY_PROFESSIONAL_AND_DAY_QUERY client',
      professionalId,
      date
    );
    const { data } = await client
      .query({
        query: FIND_APPOINTMENTS_BY_PROFESSIONAL_AND_DAY_QUERY,
        variables: {
          professionalId,
          date,
        },
      })
      .catch((error) => {
        console.error('error appointmentsByProfessionalAndDay', error);
        throw error;
      });
    console.log('data appointmentsByProfessionalAndDay', data);
    return data.appointmentsByProfessionalAndDay;
  },
};
