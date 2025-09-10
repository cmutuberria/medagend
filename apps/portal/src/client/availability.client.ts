import { gql } from '@apollo/client';
import { client } from '../apollo.client';

const FIND_AVAILABILITIES_BY_PROFESSIONAL_AND_DAY_QUERY = gql`
  query findAvailabilitiesByProfessionalAndDayQuery(
    $professionalId: ID!
    $dayOfWeek: Int!
  ) {
    availabilitiesByProfessionalAndDay(
      professionalId: $professionalId
      dayOfWeek: $dayOfWeek
    ) {
      id
      professionalId
      dayOfWeek
      startTime
      endTime
    }
  }
`;

const FIND_AVAILABILITIES_BY_PROFESSIONAL_QUERY = gql`
  query findAvailabilitiesByProfessionalQuery($professionalId: ID!) {
    availabilitiesByProfessional(professionalId: $professionalId) {
      id
      professionalId
      dayOfWeek
      startTime
      endTime
    }
  }
`;

export const availabilityClient = {
  findAvailabilitiesByProfessionalAndDay: async (
    professionalId: string,
    dayOfWeek: number
  ) => {
    console.log(
      'findAvailabilitiesByProfessionalAndDay client',
      professionalId,
      dayOfWeek
    );
    const { data } = await client.query({
      query: FIND_AVAILABILITIES_BY_PROFESSIONAL_AND_DAY_QUERY,
      variables: {
        professionalId,
        dayOfWeek,
      },
    });
    console.log('data', data);
    return data.availabilitiesByProfessionalAndDay;
  },

  findAllByProfessional: async (professionalId: string) => {
    const { data } = await client.query({
      query: FIND_AVAILABILITIES_BY_PROFESSIONAL_QUERY,
      variables: {
        professionalId,
      },
    });
    return data.availabilitiesByProfessional;
  },
};
