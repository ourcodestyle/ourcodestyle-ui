/* eslint-disable import/default */

import React from 'react';

import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import configureStore, { history } from './store/configureStore'
import configureApolloClient from '~/configure/apolloClient'
import Root from './components/Root';
import './styles/styles.scss'; // Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
require('./favicon.ico'); // Tell webpack to load favicon.ico


const { apolloClient, actionCable } = configureApolloClient()
const store = configureStore({apolloClient, actionCable});

const rootProps = {
  store,
  history,
  apolloClient,
  actionCable
}

render(
  <AppContainer>
    <Root {...rootProps} />
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    const NewRoot = require('./components/Root').default;
    render(
      <AppContainer>
        <NewRoot {...rootProps} />
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
