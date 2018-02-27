import { GraphQLSchema, graphql, print } from 'graphql';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';

import { ApolloLink } from 'apollo-link';
import Observable from 'zen-observable';

export const createBridgeLink = ({ schema, resolvers, mock }) => {
  let executableSchema;
  if (typeof schema === 'string' || Array.isArray(schema) ) {
    executableSchema = makeExecutableSchema({ typeDefs: schema, resolvers });
  } else if (schema.kind === 'Document') {
    executableSchema = makeExecutableSchema({
      typeDefs: print(schema),
      resolvers,
    });
  } else if (schema instanceof GraphQLSchema) {
    executableSchema = schema;
  } else {
    throw new Error(
      'schema should be plain text, parsed schema or executable schema'
    );
  }

  if (mock)
    addMockFunctionsToSchema({
      schema: executableSchema,
      preserveResolvers: true,
    });

  return new ApolloLink(
    operation =>
      new Observable(observer => {
        graphql(
          executableSchema,
          print(operation.query),
          undefined,
          operation.getContext(),
          operation.variables,
          operation.operationName
        )
          .then(data => {
            observer.next(data);
            observer.complete();
          })
          .catch(err => {
            /* istanbul ignore next */
            observer.error(err);
          });
      })
  );
};

export class BridgeLink extends ApolloLink {
  requester;

  constructor(opts) {
    super();
    this.requester = createBridgeLink(opts).request;
  }

  request(op) {
    return this.requester(op);
  }
}
