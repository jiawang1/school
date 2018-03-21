import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ApolloProvider } from 'react-apollo';
import config from './common/configClient';
import resolves from './resolvers';
import RootApp from 'containers/App';

const client = config(resolves);
const root = document.createElement('div');
root.className = 'root';
root.id = 'root';
document.body.appendChild(root);

render(
  <ApolloProvider client={client}>
    <RootApp />
  </ApolloProvider>,
  root
);

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('containers/App', () => {
    /*
       * must load the entry module here, therwise hot replaod can
       * not work
       * */
    const RootContainer = require('containers/App').default;
    render(
      <AppContainer>
        <ApolloProvider client={client}>
          <RootContainer />
        </ApolloProvider>
      </AppContainer>,
      root
    );
  });
}
