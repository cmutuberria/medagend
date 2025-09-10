import { gql } from '@apollo/client';
import { client } from '../apollo.client';

const FIND_PROFESSIONALS_QUERY = gql`
  query GetProfessionalsByQuery($name: String, $specialty: [String!]) {
    professionalsByQuery(name: $name, specialty: $specialty) {
      id
      email
      name
      role
      avatarUrl
      phone
      bio
      licenseNumber
      specialty
      createdAt
      updatedAt
      # availabilities {
      #   id
      #   dayOfWeek
      #   startTime
      #   endTime
      # }
    }
  }
`;

export const userClient = {
  findProfessionalsByQuery: async (name?: string, specialty?: string[]) => {
    console.log('findProfessionalsByQuery client', name, specialty);
    const { data } = await client.query({
      query: FIND_PROFESSIONALS_QUERY,
      variables: {
        name,
        specialty: specialty && specialty.length > 0 ? specialty : undefined,
      },
    });

    console.log('data', data);
    return data.professionalsByQuery;
  },
};
