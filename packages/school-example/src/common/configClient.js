import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import configLink from './configBridgeLink';
import { createContextLink } from './troopContext';

const cache = new InMemoryCache();
/**
 * @param  {} {schema  :  server side graphql schema
 * @param  {} resolver} : graphql resolver
 * @param  {} middlewares=[] : apollo links
 */
const config = ({ schema, resolver }, middlewares = []) => {
  const client = new ApolloClient({
    link: ApolloLink.from([
      createContextLink(() => client),
      ...middlewares,
      configLink({ schema, resolvers: resolver })
    ]),
    cache
  });
  return client;
};

export default config;
