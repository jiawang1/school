import { createBridgeLink } from 'apollo-bridge-link';
//mport { createBridgeLink } from './bridgeLink';

const configLink = ({ schema, resolvers }) =>
  createBridgeLink({
    schema,
    resolvers
  });

export default configLink;
