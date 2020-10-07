import React from 'react';
import { Route } from 'react-router';

import { IonContent, IonPage } from '@ionic/react';
import { home, logIn, person, thumbsDown } from 'ionicons/icons';


import q from '../adapters/typescript/queryable';
import o from '../adapters/typescript/typedObject';

import { useUserValue } from '../providers/user/hooks';

import Header from './Header';
import Footer from './Footer';

import Login from '../pages/Login';
import Home from '../pages/Home';
import UserNonconformities from '../pages/user/UserNonconformities';
import UserPage from '../pages/user/UserPage';
import Nonconformities from '../pages/Nonconformities';


export interface AltiBizRoute
{
    name: string,
    icon: string,

    route: string,
    element: React.ReactElement
}

export type AltiBizRouteGroup<RouteNames extends string> =
        {
            [Key in RouteNames]: AltiBizRoute
        }

export interface AltiBizRouteGroupNonExact extends AltiBizRouteGroup<string> {}

export interface AltiBizRoutes<PublicRouteNames extends string, PrivateRouteNames extends string>
{
    default: PublicRouteNames;
    HELB: AltiBizRouteGroup<PublicRouteNames>,
    Korisnik: AltiBizRouteGroup<PrivateRouteNames>
}

export interface AltiBizRoutesNonExact extends AltiBizRoutes<string, string> {}


const contentId = 'page-content';

export const AuthenticatedRoutes: AltiBizRoutes<'home' | 'nonconformities', 'user' | 'userNonconformities'> =
        {
            default: 'home',
            HELB:
                    {
                        'home':
                                {
                                    name: 'Početna',
                                    icon: home,
                                    route: '/pocetna',
                                    element:
                                            <div id={contentId} className="ion-padding">
                                                <Home/>
                                            </div>
                                },
                        'nonconformities':
                                {
                                    name: 'Nesukladnosti',
                                    icon: thumbsDown,
                                    route: '/nesukladnosti',
                                    element:
                                            <IonContent id={contentId} className="ion-padding">
                                                <Nonconformities/>
                                            </IonContent>
                                }
                    },
            Korisnik:
                    {
                        'user':
                                {
                                    name: 'Korisnik',
                                    icon: person,
                                    route: '/korisnik',
                                    element:
                                            <IonContent id={contentId} className="ion-padding">
                                                <UserPage/>
                                            </IonContent>
                                },
                        'userNonconformities':
                                {
                                    name: 'Vaše nesukladnosti',
                                    icon: thumbsDown,
                                    route: '/korisnik/nesukladnosti',
                                    element:
                                            <IonContent id={contentId} className="ion-padding">
                                                <UserNonconformities/>
                                            </IonContent>
                                }
                    }
        };

export const UnauthenticatedRoutes: AltiBizRoutes<'login', string> =
        {
            default: 'login',
            HELB:
                    {
                        'login':
                                {
                                    name: 'Prijava',
                                    icon: logIn,
                                    route: '/prijava',
                                    element:
                                            <div id={contentId} className="ion-padding">
                                                <Login/>
                                            </div>
                                }
                    },
            Korisnik: {}
        };


const mapRoutesToElement = (routes: AltiBizRoutesNonExact) =>
        <>
            {
                q(o.values(o.omit(routes, 'default')))
                        .map(routeGroup => q(o.entries(routeGroup))
                                .map(route =>
                                        <Route key={route[0]}
                                               path={route[1].route}
                                               render={() =>
                                                       <IonPage>
                                                           <Header contentId={contentId}/>
                                                           {route[1].element}
                                                           <Footer contentId={contentId}/>
                                                       </IonPage>
                                               }/>))
                        .flatten()
                        .toArray()
            }
        </>;


const Router: React.FC = () =>
        useUserValue() ?
        mapRoutesToElement(AuthenticatedRoutes) :
        mapRoutesToElement(UnauthenticatedRoutes);

export default React.memo(Router);
