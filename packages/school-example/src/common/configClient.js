import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createAsyncLink, createProgressLink } from '@shanghai/apollo-link-async';
import { troopClient } from '@shanghai/troop-adapter';
import { progresshandler } from 'components/loadingBar/LoadingBar';
import { createContextLink } from './troopContext';
import baseConfig from '../../config/base.config';

const cache = new InMemoryCache();

const graphqlAdapter = {
  query: (troopQuery, troopContext) =>
    troopClient.query(baseConfig.troopQueryContext, troopQuery, { troopContext }).catch(err => {
      console.log(err);
    }),
  mutate: (command, body, troopContext) =>
    troopClient.postCommandWithObject(command, body, troopContext)
};

/**
 * @param  {} resolver : graphql resolver
 * @param  {} middlewares=[] : apollo links
 */
const config = (resolver, middlewares = []) => {
  const asyncLink = createAsyncLink(graphqlAdapter, resolver);
  const progressLink = createProgressLink(progresshandler);
  const client = new ApolloClient({
    link: ApolloLink.from([
      createContextLink(() => client),
      ...middlewares,
      progressLink,
      asyncLink
    ]),
    cache
  });
  return client;
};

export default config;
