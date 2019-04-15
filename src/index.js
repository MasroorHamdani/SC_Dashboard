import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";
import './sass/index.scss';
import App from './App';
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.js";
import * as firebase from 'firebase';

import { Provider } from "react-redux";
import configureStore from "./store";

const store = configureStore();

var config = {
  apiKey: "AIzaSyDtPZbD5dB3QZzx-U_bB2zSVUYuZn_WcMs",
  authDomain: "smartclea-data.firebaseapp.com",
  databaseURL: "https://smartclea-data.firebaseio.com",
  projectId: "smartclea-data",
  storageBucket: "smartclea-data.appspot.com",
  messagingSenderId: "259944623858"
};
firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots: true
});

ReactDOM.render(<I18nextProvider i18n={i18n}>
              <Provider store={store}>
                <Router
                 basename="/optimus"
                 ><App /></Router>
              </Provider>
            </I18nextProvider>,
            document.getElementById('root'));

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

// ReactDOM.render(
//   <I18nextProvider i18n={i18n}>
//     <App />
//   </I18nextProvider>,
//   document.getElementById("root")
// );