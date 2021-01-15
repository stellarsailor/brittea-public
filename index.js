/**
 * @format
 */
import React, { useEffect } from 'react'
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './redux'

const store = createStore(rootReducer);

import codePush from "react-native-code-push";

const RNRedux = () => {
  return(
    <Provider store = { store }>
      <App />
    </Provider>
  )
}

const MyApp = codePush(RNRedux)

AppRegistry.registerComponent(appName, () => MyApp);
