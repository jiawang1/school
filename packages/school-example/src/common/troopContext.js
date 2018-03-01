import { setContext } from 'apollo-link-context';
import gql from 'graphql-tag';

const contextQL = gql`
  query queryContext($id: String!) {
    context(id: $id) {
      id
      values {
        countrycode {
          value
        }
        culturecode {
          value
        }
        partnercode {
          value
        }
        siteversion {
          value
        }
        languagecode {
          value
        }
        studentcountrycode {
          value
        }
      }
    }
  }
`;

const formatContext = context => ({
  currentContext: JSON.parse(
    JSON.stringify(context, (k, v) => (k === '__typename' ? undefined : v))
  )
});

const queryContext = async client => {
  const context = await client.query({
    query: contextQL,
    variables: { id: 'current' }
  });

  if (context.data && context.data.context) {
    return formatContext(context.data.context[0]);
  }
};

const createContextLink = getClient =>
  setContext((request, previousContext) => {
    if (previousContext.currentContext) {
      return;
    }
    const client = getClient();
    try {
      const _context = client.readQuery({
        query: contextQL,
        variables: { id: 'current' }
      });
      return formatContext(_context.currentContext[0]);
    } catch (err) {
      if (request.operationName !== 'queryContext') {
        return queryContext(client).catch(err => {
          console.error(err);
        });
      }
    }
  });
export { queryContext, createContextLink, contextQL };
