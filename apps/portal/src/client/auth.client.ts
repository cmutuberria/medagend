import { gql } from '@apollo/client';
import { client } from '../apollo.client';
import { User } from '../models/user.model';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
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
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const authClient = {
  login: async (email: string, password: string): Promise<string> => {
    console.log({ email, password });
    const { data } = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    });
    console.log({ data });
    return data.login;
  },
  me: async (): Promise<User> => {
    const { data } = await client.query({
      query: ME_QUERY,
    });
    console.log({ data });
    return data.me;
  },
  logout: async (): Promise<void> => {
    const { data } = await client.mutate({
      mutation: LOGOUT_MUTATION,
    });
    console.log({ data });
  },
};
