import { ApolloClient } from 'apollo-client'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { createUploadLink } from 'apollo-upload-client'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory'
import Storage from '~/services/storage'

import introspectionQueryResultData from '~/gql/fragmentTypes.json';

import ActionCable from 'actioncable'
import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink'

const configureApolloClient = () => {

  const apiUri = '/graphql'

  const buildApolloLink = () => {
    return ApolloLink.from([
      onError((data) => {
        console.log('onError data');
        console.dir(data);
        const { graphQLErrors, networkError, operation } = data
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
          );
        }
        if (networkError) {
          console.log('operation');
          console.dir(operation);
          // response.errors = ['not found']
          console.log(`[Network error]: ${networkError}`);
          // return {error: true}
        }
      }),
      createUploadLink({
        uri: apiUri,
        headers: {
          "Authorization": `Bearer ${Storage.get('userToken')}`
        }
      }),
    ])
  }

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = Storage.get('userToken')
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        "Authorization": `Bearer ${token}`
      }
    }
  })
  const httpLink =  authLink.concat(buildApolloLink())

  const hasSubscriptionOperation = ({ query: { definitions } }) => {
    return definitions.some(
      ({ kind, operation }) => kind === 'OperationDefinition' && operation === 'subscription'
    )
  }
  const userToken = Storage.get('userToken')

  const WS_URL_NEW = `${window.location.origin}`;

  const actionCable = ActionCable.createConsumer(WS_URL_NEW + '/cable?auth_token=' + userToken)
  const link = ApolloLink.split(
    hasSubscriptionOperation,
    new ActionCableLink({cable: actionCable}),
    httpLink
  )

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });
  const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache({ fragmentMatcher })
  });

  return { apolloClient, actionCable }
}

export default configureApolloClient