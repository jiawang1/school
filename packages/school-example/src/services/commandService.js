import gql from 'graphql-tag';

const commandQL = gql`
  query queryCommand($id: String!) {
    command(id: $id) {
      id
      results
    }
  }
`;

const queryCommand = (client, id = '*') =>
  client.query({
    query: commandQL,
    variables: { id }
  });
export { commandQL, queryCommand };
