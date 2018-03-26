import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createAsyncLink, createProgressLink } from '@shanghai/apollo-link-async';
import { troopClient } from '@shanghai/troop-adapter';
import { createContextLink } from './troopContext';
import baseConfig from '../../config/base.config';
import progresshandler from 'components/spin';

const cache = new InMemoryCache();

const graphqlWrapper = {
  query: (url, troopContext) =>
    troopClient.query(baseConfig.troopQueryContext, url, { troopContext }),
  mutate: (commandName, body, ops) => troopClient.postCommand(commandName, body, ops).then(() => {})
};

// const progresshandler = {
//   show: () => {
//     console.log('show');
//   },
//   hide: () => {
//     console.log('hide');
//   }
// };

/**
 * @param  {} resolver : graphql resolver
 * @param  {} middlewares=[] : apollo links
 */
const config = (resolver, middlewares = []) => {
  const asyncLink = createAsyncLink(graphqlWrapper, resolver);
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
