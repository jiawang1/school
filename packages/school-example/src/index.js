import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ApolloProvider } from 'react-apollo';
import config from './common/configClient';
// import { resolver } from './server';
import RootApp from './containers/Routes';
import './styles/index.less';

const client = config();
const root = document.createElement('div');
root.className = 'app-root';
root.id = 'app-root';
document.body.appendChild(root);

render(
  <ApolloProvider client={client}>
    <RootApp />
  </ApolloProvider>,
  root
);

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./containers/Routes', () => {
    /*
       * must load the entry module here, therwise hot replaod can
       * not work
       * */
    const RootContainer = require('./containers/Routes').default;
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
