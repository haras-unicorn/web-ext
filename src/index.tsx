import React from 'react';
import ReactDOM from 'react-dom';

import { defineCustomElements } from '@ionic/pwa-elements/loader';

import * as serviceWorker from './serviceWorker';

import environment from './environments/active';
import App from './App';


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
environment.isDevelopment ? serviceWorker.unregister() : serviceWorker.register();

// Capacitor plugins for PWA.
defineCustomElements(window).then(
        () => ReactDOM.render(
                <App/>,
                document.getElementById('root')));
