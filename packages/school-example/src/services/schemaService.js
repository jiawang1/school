import gql from 'graphql-tag';

const schemaQL = gql`
  query querySchema {
    __schema {
      types {
        name
        kind
      }
    }
  }
`;
const querySchema = client =>
  client.query({
    query: schemaQL
  });
export { schemaQL, querySchema };
