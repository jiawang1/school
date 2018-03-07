import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import configLink from './configBridgeLink';
import { createContextLink } from './troopContext';
// /import { withClientState } from 'apollo-link-state';

// const cache = new InMemoryCache({
//   addTypename: false
// });

const cache = new InMemoryCache();

/**
 * @param  {} {schema  :  server side graphql schema
 * @param  {} resolver} : graphql resolver
 * @param  {} middlewares=[] : apollo links
 */
const config = ({ schema, resolver }, middlewares = []) => {
  // const stateLink = withClientState({
  //   cache,
  //   resolvers: resolver
  // });

  const client = new ApolloClient({
    link: ApolloLink.from([
      createContextLink(() => client),
      ...middlewares,
      // stateLink
      configLink({ schema, resolvers: resolver })
    ]),
    cache
  });
  return client;
};

export default config;
