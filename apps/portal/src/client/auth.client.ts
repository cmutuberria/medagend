import { gql } from '@apollo/client';
import { client } from '../apollo.client';
import { User, CreateUserInput } from '../models/user.model';

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

const REFRESH_MUTATION = gql`
  mutation Refresh {
    refresh
  }
`;

const SIGNUP_MUTATION = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      email
      name
      role
      phone
      bio
      licenseNumber
      specialty
      createdAt
    }
  }
`;

export const authClient = {
  login: async (email: string, password: string): Promise<string> => {
    const { data } = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    });
    return data.login;
  },
  me: async (): Promise<User> => {
    const { data } = await client.query({
      query: ME_QUERY,
      fetchPolicy: 'network-only',
    });
    return data.me;
  },
  logout: async (): Promise<void> => {
    await client.mutate({
      mutation: LOGOUT_MUTATION,
      fetchPolicy: 'network-only',
    });
  },
  refresh: async (): Promise<string> => {
    const { data } = await client.mutate({
      mutation: REFRESH_MUTATION,
    });
    return data.refresh;
  },
  signup: async (user: CreateUserInput): Promise<User> => {
    const { data } = await client.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { createUserInput: user },
    });
    return data.createUser;
  },
};
