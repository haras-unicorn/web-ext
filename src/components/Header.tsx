import React from 'react';
import { useHistory } from 'react-router';

import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonItemDivider,
    IonItemGroup,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonPopover,
    IonThumbnail,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { logOut, menu, person, personOutline } from 'ionicons/icons';


import { useUser } from '../providers/user/hooks';

import o from '../adapters/typescript/typedObject';
import q from '../adapters/typescript/queryable';

import environment from '../environments/active';

import { AltiBizRouteGroupNonExact, AltiBizRoutesNonExact, AuthenticatedRoutes, UnauthenticatedRoutes } from './Router';


const menuId = 'header-menu';

interface Props
{
    contentId: string
}


const createOpenMenuPage = (
        route: string,
        history: ReturnType<typeof useHistory>,
        menuRef: React.RefObject<HTMLIonMenuElement>) =>
        () =>
        {
            menuRef.current?.close().then(() => history.push(route));
        };

const renderDefaultRouteLink = (
        routes: AltiBizRoutesNonExact,
        history: ReturnType<typeof useHistory>,
        menuRef: React.RefObject<HTMLIonMenuElement>) =>
        <>
            <IonItemGroup>
                <IonItem button
                         onClick={createOpenMenuPage(routes.HELB[routes.default].route, history, menuRef)}>
                    <IonLabel>
                        {routes.HELB[routes.default].name}
                    </IonLabel>
                    <IonIcon icon={routes.HELB[routes.default].icon}/>
                </IonItem>
            </IonItemGroup>
        </>;

const renderRouteGroupLinks = (
        routes: AltiBizRoutesNonExact,
        routeGroup: AltiBizRouteGroupNonExact,
        history: ReturnType<typeof useHistory>,
        menuRef: React.RefObject<HTMLIonMenuElement>) =>
        q(o.entries(routeGroup))
                .takeIf(route => route[0] !== routes.default)
                .map(route =>
                        <IonItem key={route[0]}
                                 button
                                 onClick={createOpenMenuPage(route[1].route, history, menuRef)}>
                            <IonLabel>{route[1].name}</IonLabel>
                            <IonIcon icon={route[1].icon}/>
                        </IonItem>)
                .toArray();

const renderRouteLinks = (
        routes: AltiBizRoutesNonExact,
        history: ReturnType<typeof useHistory>,
        menuRef: React.RefObject<HTMLIonMenuElement>) =>
        <>
            <IonItemDivider>
                <IonLabel>
                    Općenito
                </IonLabel>
            </IonItemDivider>
            {renderDefaultRouteLink(routes, history, menuRef)}
            {
                q(o.entries(o.omit(routes, 'default')))
                        .map(routeGroup =>
                                <React.Fragment key={routeGroup[0]}>
                                    <IonItemDivider>
                                        <IonLabel>
                                            {routeGroup[0]}
                                        </IonLabel>
                                    </IonItemDivider>
                                    <IonItemGroup>
                                        {renderRouteGroupLinks(routes, routeGroup[1], history, menuRef)}
                                    </IonItemGroup>
                                </React.Fragment>)
                        .toArray()
            }
        </>;


const Header: React.FC<Props> = (props: Props) =>
{
    const [user, userUpdate] = useUser();

    const history = useHistory();

    const [popoverOpenEvent, setPopoverOpenEvent] =
            React.useState<Event | undefined>(undefined);
    const menuRef = React.useRef<HTMLIonMenuElement>(null);


    // I'm not expecting the username to change a lot, so I memoize this.
    // Refs and ids shouldn't change under any circumstances.
    const propsPageId = props.contentId;
    const menuRender = React.useMemo(
            () =>
                    <IonMenu contentId={propsPageId}
                             menuId={menuId}
                             ref={menuRef}>
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>Stranice</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent>
                            {
                                user ?
                                renderRouteLinks(AuthenticatedRoutes, history, menuRef) :
                                renderRouteLinks(UnauthenticatedRoutes, history, menuRef)
                            }
                        </IonContent>
                    </IonMenu>,
            [user, propsPageId, menuRef, history]);

    // Depends on the whole state, so no need to memoize
    const popoverRender =
            user &&
            <IonPopover isOpen={Boolean(popoverOpenEvent)}
                        event={popoverOpenEvent}
                        onDidDismiss={() => setPopoverOpenEvent(undefined)}>
                <IonList>
                    <IonListHeader>
                        <IonLabel>
                            <h2>Korisnik</h2>
                        </IonLabel>
                    </IonListHeader>
                    <IonItemDivider>
                        <IonLabel>Pregled</IonLabel>
                    </IonItemDivider>
                    <IonItemGroup>
                        <IonItem button
                                 onClick={
                                     () =>
                                     {
                                         setPopoverOpenEvent(undefined);
                                         history.push(AuthenticatedRoutes.Korisnik.user.route);
                                     }}>
                            <IonLabel>Korisničke informacije</IonLabel>
                            <IonIcon icon={personOutline}/>
                        </IonItem>
                    </IonItemGroup>
                    <IonItemDivider>
                        <IonLabel>Akcije</IonLabel>
                    </IonItemDivider>
                    <IonItemGroup>
                        <IonItem button
                                 onClick={() =>
                                 {
                                     setPopoverOpenEvent(undefined);
                                     userUpdate(null);
                                     history.push(UnauthenticatedRoutes.HELB[UnauthenticatedRoutes.default].route);
                                 }}>
                            <IonLabel color="danger">Odjava</IonLabel>
                            <IonIcon icon={logOut} color="danger"/>
                        </IonItem>
                    </IonItemGroup>
                </IonList>
            </IonPopover>;


    // I'm not expecting the username to change a lot, so I memoize this.
    const headerRender = React.useMemo(
            () =>
                    <IonHeader>
                        <IonToolbar>
                            <IonButtons slot="start">
                                { /* TODO: fix this so user conformities work with menu button */ }
                                <IonButton type="button" onClick={() => menuRef.current?.open(true)}>
                                    <IonIcon icon={menu} color="primary"/>
                                </IonButton>
                            </IonButtons>
                            {
                                user ?

                                <>
                                    <IonTitle class="ion-text-end">
                                        {
                                            environment.isDevelopment || !user.username ?
                                            `Henlo, fren 🐶` :
                                            `Dobrodošli, ${user.username}`
                                        }
                                    </IonTitle>

                                    <IonButtons slot="end">
                                        <IonButton onClick={event => setPopoverOpenEvent(event.nativeEvent)}>
                                            <IonIcon icon={person} color="secondary"/>
                                        </IonButton>
                                    </IonButtons>
                                </>
                                     :
                                <>
                                    <IonTitle class="ion-text-center">Prijava</IonTitle>
                                    <IonButtons slot="end">
                                        <IonThumbnail slot="end" style={{'--size': '50%'}}>
                                            <IonImg src="assets/icon/favicon.png"/>
                                        </IonThumbnail>
                                    </IonButtons>
                                </>
                            }
                        </IonToolbar>
                    </IonHeader>,
            [user]);


    return (
            <>
                {menuRender}
                {popoverRender}
                {headerRender}
            </>
    );
};

export default Header;
