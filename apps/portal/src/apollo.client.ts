import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { fromPromise } from '@apollo/client/link/utils';
import { authClient } from './client/auth.client';
import { useAuthStore } from './stores/auth.store';
const apiUrl = import.meta.env.VITE_API_URL;

const httpLink = createHttpLink({
  // uri: 'http://localhost:3000/graphql',
  uri: `${apiUrl}/graphql`,
  credentials: 'include', // Incluir cookies
});

// 2. Auth Link - Inyectar access token en headers
const authLink = setContext((_, { headers }) => {
  const { token } = useAuthStore.getState();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// 3. Error Link - Manejo inteligente de errores de autenticación
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  const { setToken, setUser } = useAuthStore.getState();
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        return fromPromise(
          authClient
            .refresh()
            .then((newToken) => {
              if (newToken) {
                setToken(newToken);

                operation.setContext({
                  headers: {
                    ...operation.getContext().headers,
                    authorization: `Bearer ${newToken}`,
                  },
                });
              }
            })
            .catch(() => {
              setToken(null);
              setUser(null);
              authClient.logout().catch((error) => {
                console.error('Error durante logout:', error);
              });
              window.location.href = '/login';
            })
        ).flatMap(() => {
          return forward(operation);
        });
      }
    }
  }
});

// 4. Cliente Apollo final con cadena de links
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: 'cache-first',
  //   },
  // },
});
