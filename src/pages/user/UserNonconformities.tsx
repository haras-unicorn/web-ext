import React from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';

import {
    IonAlert,
    IonButton,
    IonButtons,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonModal,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { add, close, remove } from 'ionicons/icons';


import { NonconformityQueryResult, READ_USER_NONCONFORMITIES } from '../../providers/server/nonconformities/queries';
import {
    DELETE_USER_NONCONFORMITY,
    NonconformityMutationResult
} from '../../providers/server/nonconformities/mutations';
import { DELETE_IMAGE } from '../../providers/server/image/mutation';
import Report from '../../providers/Report';

import NonconformityMultipartForm from '../../components/forms/NonconformityMultipartForm';
import Nonconformity from '../../components/views/Nonconformity';
import Image from '../../components/views/images/Image';


const UserNonconformities: React.FC = () =>
{
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [deleteAlertNonconformityId, setDeleteAlertNonconformityId] =
            React.useState<string | null>(null);


    const [readUserNonconformities, userNonconformities] = useLazyQuery<{
        readUserNonconformities: NonconformityQueryResult[]
    }>(
            READ_USER_NONCONFORMITIES,
            {
                fetchPolicy: 'cache-and-network',
                nextFetchPolicy: 'cache-first'
            });

    React.useEffect(readUserNonconformities, []);


    const [deleteUserNonconformity, deleteUserNonconformityResult] = useMutation<{
        deleteUserNonconformity: NonconformityMutationResult
    }, {
        input: { id: string }
    }>(
            DELETE_USER_NONCONFORMITY
    );

    const [deleteImage, deleteImageResult] = useMutation<{
        deleteImage: string
    }, {
        id: string
    }>(
            DELETE_IMAGE
    );


    const readUserNonfonformitiesData = userNonconformities?.data?.readUserNonconformities;
    const nonconformitiesRender = React.useMemo(
            () =>
                    readUserNonfonformitiesData &&
                    readUserNonfonformitiesData.map(
                            nonconformity =>
                                    <Nonconformity
                                            key={nonconformity.id}
                                            name={nonconformity.name}
                                            description={nonconformity.description}>
                                        {{
                                            button:
                                                    <IonButton color="danger"
                                                               onClick={() =>
                                                                       setDeleteAlertNonconformityId(
                                                                               nonconformity.id)}>
                                                        <IonIcon icon={remove}/>
                                                    </IonButton>,
                                            image:
                                                    <Image imageId={nonconformity.imageId}/>
                                        }}
                                    </Nonconformity>),
            [readUserNonfonformitiesData]);

    const modalRender = React.useMemo(
            () =>
                    <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>Prijava nesukladnosti</IonTitle>
                                <IonButtons slot="end">
                                    <IonButton onClick={() => setShowAddModal(false)}>
                                        <IonIcon color="danger" icon={close}/>
                                    </IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                        <NonconformityMultipartForm afterSubmit={
                            () =>
                            {
                                setShowAddModal(false);
                                readUserNonconformities();
                            }}/>
                    </IonModal>,
            [readUserNonconformities, showAddModal]);

    const fabRender = React.useMemo(
            () =>
                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton onClick={() => setShowAddModal(true)}>
                            <IonIcon icon={add}/>
                        </IonFabButton>
                    </IonFab>,
            []);


    // Don't memo because it depends on too many things.
    const deleteAlertRender =
            <IonAlert isOpen={deleteAlertNonconformityId !== null}
                      onDidDismiss={() => setDeleteAlertNonconformityId(null)}
                      message="Jeste li sigurni da želite obrisati nesukladnost?"
                      buttons={
                          [
                              {
                                  text: 'Ne',
                                  role: 'cancel'
                              },
                              {
                                  text: 'Da',
                                  handler: async () =>
                                  {
                                      if (deleteAlertNonconformityId)
                                      {
                                          const result = await deleteUserNonconformity({
                                              variables: {
                                                  input: {
                                                      id: deleteAlertNonconformityId
                                                  }
                                              }
                                          });
                                          if (result.data?.deleteUserNonconformity.imageId)
                                              await deleteImage({
                                                  variables: {
                                                      id: result.data.deleteUserNonconformity.imageId
                                                  }
                                              });
                                      }

                                      readUserNonconformities();
                                  }
                              }
                          ]
                      }/>;

    // Don't memo - depends on a lot of things.
    const reportRender =
            <Report concat={[userNonconformities, deleteUserNonconformityResult, deleteImageResult]}>
                {{
                    errorText: 'Dogodila se greška.'
                }}
            </Report>;


    return (
            <>
                {deleteAlertRender}
                {modalRender}
                {reportRender}
                {nonconformitiesRender}
                {fabRender}
            </>
    );
};


export default React.memo(UserNonconformities);
