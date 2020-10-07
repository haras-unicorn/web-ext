import React from 'react';
import { useHistory } from 'react-router';
import { IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonText } from '@ionic/react';


import o from '../adapters/typescript/typedObject';
import q from '../adapters/typescript/queryable';

import { AltiBizRouteGroupNonExact, AuthenticatedRoutes } from '../components/Router';


const Home: React.FC = () =>
{
    const history = useHistory();

    // Literally no need to memoize
    const renderRouteGroup =
            (routeGroup: AltiBizRouteGroupNonExact) =>
                    q(o.entries(routeGroup))
                            .map(route =>
                                    <IonCol key={route[0]}>
                                        <IonItem button
                                                 onClick={
                                                     () => history.push(route[1].route)}>
                                            <IonLabel>{route[1].name}</IonLabel>
                                            <IonIcon slot="end"
                                                     icon={route[1].icon}/>
                                        </IonItem>
                                    </IonCol>)
                            .toArray();

    return (
            <IonGrid>
                {
                    q(o.entries(o.omit(AuthenticatedRoutes, 'default')))
                            .map(routeGroup =>
                                    <IonRow key={routeGroup[0]}>
                                        <IonCol>
                                            <IonText color="primary">
                                                <p>{routeGroup[0]}</p>
                                            </IonText>
                                        </IonCol>
                                        {renderRouteGroup(routeGroup[1])}
                                    </IonRow>)
                            .toArray()
                }
            </IonGrid>
    );
};


export default React.memo(Home);
