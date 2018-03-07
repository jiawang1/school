import { createBridgeLink } from 'apollo-bridge-link';
// import { createBridgeLink } from './bridgeLink';

const configLink = ({ schema, resolvers }) =>
  createBridgeLink({
    schema,
    resolvers
  });

export default configLink;
