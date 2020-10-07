import React from 'react';

import { IonRefresher, IonRefresherContent } from '@ionic/react';
import { arrowDown } from 'ionicons/icons';

import { useLazyQuery } from '@apollo/client';


import { NonconformityQueryResult, READ_NONCONFORMITIES } from '../providers/server/nonconformities/queries';

import Nonconformity from '../components/views/Nonconformity';
import Image from '../components/views/images/Image';
import Report from '../providers/Report';


const Nonconformities: React.FC = () =>
{
    const [readNonconformities, nonconformities] = useLazyQuery<{ readNonconformities: NonconformityQueryResult[] }>(
            READ_NONCONFORMITIES,
            {
                fetchPolicy: 'cache-and-network',
                nextFetchPolicy: 'cache-first',
                onCompleted: () => refresherRef.current?.complete(),
                onError: () => refresherRef.current?.cancel()
            });

    React.useEffect(readNonconformities, []);


    const refresherRef = React.useRef<HTMLIonRefresherElement>(null);
    const refresherRender = React.useMemo(
            () =>
                    <IonRefresher slot="fixed"
                                  ref={refresherRef}
                                  onIonRefresh={() => readNonconformities()}>
                        <IonRefresherContent
                                pullingIcon={arrowDown}
                                pullingText="Dohvati nesukladnosti..."
                                refreshingSpinner="crescent"
                                refreshingText="Dohvaćam nesukladnosti..."/>
                    </IonRefresher>,
            [refresherRef, readNonconformities]);

    const readNonfonformitiesData = nonconformities?.data?.readNonconformities;
    const nonconformitiesRender = React.useMemo(
            () =>
                    readNonfonformitiesData?.map(
                            nonconformity =>
                                    <Nonconformity
                                            key={nonconformity.id}
                                            name={nonconformity.name}
                                            description={nonconformity.description}>
                                        {{image: <Image imageId={nonconformity.imageId}/>}}
                                    </Nonconformity>),
            [readNonfonformitiesData]);


    const reportRender =
            <Report concat={[nonconformities]}>
                {{
                    errorText: 'Dogodila se greška.'
                }}
            </Report>;


    return (
            <>
                {refresherRender}
                {reportRender}
                {nonconformitiesRender}
            </>
    );
};

export default React.memo(Nonconformities);
