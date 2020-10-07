/* React */
import React, { useState } from 'react';

/* Capacitor */
/* Ionic */
import { IonApp, IonProgressBar, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Apollo */
import { ApolloProvider } from '@apollo/client';

import { createClient, persistAppState, restoreAppState } from './providers/client';
import Report, { shouldReport } from './providers/Report';

import useLoadPair from './adapters/react/hooks/useLoadPair';


/* Main compnents */
import Router from './components/Router';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Union CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';


const App: React.FC = () =>
{
    const [isReady, setIsReady] = useState(false);
    useLoadPair(
            async () =>
            {
                await restoreAppState();
                setIsReady(true);
            },
            async () =>
            {
                isReady && await persistAppState();
            });

    if (shouldReport(!isReady)) return (
            <div className="ion-padding">
                <Report concat={[!isReady]}>
                    {{
                        loadingText: 'Inicijaliziram aplikaciju...',
                        progressIndicator: <IonProgressBar type="indeterminate"/>,
                        errorText: 'Dogodila se greška tokom inicijalizacije aplikacije. Molim osvježite aplikaciju.',
                        finalText: 'Još malo i gotova je inicijalizacija aplikacije. 😊'
                    }}
                </Report>
            </div>
    );

    return (
            <ApolloProvider client={createClient()}>
                <IonApp>
                    <IonReactRouter>
                        <IonRouterOutlet>
                            <Router/>
                        </IonRouterOutlet>
                    </IonReactRouter>
                </IonApp>
            </ApolloProvider>
    );
};


export default App;
