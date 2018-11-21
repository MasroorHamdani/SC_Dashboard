import React from 'react';
import ReactDOM from 'react-dom';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';

import common_de from "./translations/de/common.json";
import common_en from "./translations/en/common.json";
import './sass/index.css';
import App from './containers/App';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
// const AppWithI18n = withI18n()(App); // pass `t` function to App
// // append app to dom
// ReactDOM.render(
//   <AppWithI18n />,
//   document.getElementById("root")
// );
// i18next.init({
//     interpolation: { escapeValue: false },  // React already does escaping
//     lng: 'en',                              // language to use
//     resources: {
//         en: {
//             common: common_en               // 'common' is our custom namespace
//         },
//         de: {
//             common: common_de
//         },
//     },
// });

// ReactDOM.render(
//     <I18nextProvider i18n={i18next}>
//         <App/>
//     </I18nextProvider>,
//     document.getElementById('root')
// );