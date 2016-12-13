import React from 'react';
import { render } from 'react-dom';
import GoogleAnalytics from 'react-ga';
import merge from 'lodash/merge';
import { getStoredState, createPersistor } from 'redux-persist';

import Root from './containers/Root/Root';
import rootSaga from './modules/rootSaga';
import getRoutes from './routes';
import { history, runSentry } from './services';
import configureStore from './store/configureStore';
import config from './config';
import * as firebase from 'firebase';

GoogleAnalytics.initialize(config.app.googleAnalytics.appId);
runSentry();

const firebaseConfig = {
  apiKey: 'AIzaSyDnSQdro-sLZa3ftteaJxnUWG_NF0jVv2Q',
  authDomain: 'chat-sandbox-88b42.firebaseapp.com',
  databaseURL: 'https://chat-sandbox-88b42.firebaseio.com',
  storageBucket: 'chat-sandbox-88b42.appspot.com',
  messagingSenderId: '486045074886'
};
firebase.initializeApp(firebaseConfig);

async function renderClient() {
  const persistConfig = {
    whitelist: ['entities', 'pagination']
  };

  // window.__data = initial state passed down by server to client
  let initialState = window.__data; // eslint-disable-line
  try {
    const restoredState = await getStoredState(persistConfig);
    initialState = merge({}, initialState, restoredState);
  } catch (error) {
    console.log('error restoring state:', error);
  }

  const dest = document.getElementById('content');
  const store = configureStore(history, initialState);
  const persistor = createPersistor(store, persistConfig); // eslint-disable-line

  store.runSaga(rootSaga);

  render(
    <Root store={store} history={history} routes={getRoutes(store)} />,
    dest
  );

  if (process.env.NODE_ENV !== 'production') {
    window.React = React; // enable debugger
  }
}

renderClient();
