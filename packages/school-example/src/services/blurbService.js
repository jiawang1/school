import gql from 'graphql-tag';

const blurbQL = gql`
  query queryBlurb($id: [String]!) {
    blurb(id: $id) {
      id
      translation
    }
  }
`;

const queryBlurb = (client, id = []) =>
  client.query({
    query: blurbQL,
    variables: { id }
  });

export { blurbQL, queryBlurb };
