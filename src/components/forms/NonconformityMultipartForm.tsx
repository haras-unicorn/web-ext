import React from 'react';

import { IonInput, IonProgressBar, IonTextarea } from '@ionic/react';
import { image, text } from 'ionicons/icons';
import { CameraPhoto } from '@capacitor/core';

import { useMutation } from '@apollo/client';


import { useUserValue } from '../../providers/user/hooks';
import { CREATE_IMAGE } from '../../providers/server/image/mutation';
import Report, { shouldReport } from '../../providers/Report';

import * as Forms from '../../adapters/forms/Forms';
import Image from '../views/images/Image';
import Nonconformity from '../views/Nonconformity';
import { CREATE_USER_NONCONFORMITY } from '../../providers/server/nonconformities/mutations';
import { READ_NONCONFORMITIES, READ_USER_NONCONFORMITIES } from '../../providers/server/nonconformities/queries';


interface FormValues
{
    name: string;
    description: string;
    image: CameraPhoto | null;
}

interface Props
{
    initialFormValues?: FormValues;
    afterSubmit: () => void;
}


// noinspection DuplicatedCode
const NonconformityMultipartForm: React.FC<Props> = (props: Props) =>
{
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

    const [submitImage, submitImageResult] = useMutation<{
        createImage: { id: string }
    }, {
        input: { image: string }
    }>(
            CREATE_IMAGE,
            {
                fetchPolicy: 'no-cache'
            });

    const [submitNonconformity, submitNonconformityResult] = useMutation<{
        createUserNonconformity: { name: string, description: string, imageId: string }
    }, {
        input: { name: string, description: string, imageId?: string | undefined }
    }>(
            CREATE_USER_NONCONFORMITY,
            {
                fetchPolicy: 'no-cache',
                refetchQueries:
                        [
                            {
                                query: READ_NONCONFORMITIES
                            },
                            {
                                query: READ_USER_NONCONFORMITIES
                            }
                        ]
            });

    const user = useUserValue();


    const formChildrenRender = React.useMemo(
            () =>
            {
                return {
                    parts:
                            [
                                <Forms.FormPart name="Opis"
                                                switchIcon={text}>
                                    <Forms.Item name="name"
                                                rules={{required: 'Naziv je potreban.'}}>
                                        {{
                                            label:
                                                    <Forms.ItemLabel position="fixed">
                                                        Naziv
                                                    </Forms.ItemLabel>,

                                            input: <IonInput type="text"
                                                             autofocus
                                                             inputmode="text"
                                                             placeholder="Naziv nesukladnosti ovdje"/>,

                                            errorText: true
                                        }}
                                    </Forms.Item>

                                    <Forms.Item name="description"
                                                rules={{
                                                    required: 'Opis nesukladnosti je potreban',
                                                    maxLength:
                                                            {
                                                                value: 300,
                                                                message: 'Opis ne smije biti dulji od 300 znakova'
                                                            }
                                                }}

                                                style={{
                                                    '--min-height': '100px'
                                                }}>
                                        {{
                                            label:
                                                    <Forms.ItemLabel position="floating">
                                                        Opis
                                                    </Forms.ItemLabel>,

                                            input: <IonTextarea autoGrow
                                                                inputmode="text"
                                                                placeholder="Opis nesukladnosti ovdje"/>,

                                            errorText: true
                                        }}
                                    </Forms.Item>
                                </Forms.FormPart>,

                                <Forms.FormPart name="Slika"
                                                switchIcon={image}>
                                    <Forms.ImageItem name="image"/>
                                </Forms.FormPart>
                            ] as React.ComponentProps<typeof Forms.MultipartForm>['children']['parts'],

                    preview:
                            {
                                renderOnOpen: (fieldValues: FormValues) =>
                                        <Nonconformity
                                                apellant={user?.username}
                                                name=
                                                        {
                                                            fieldValues.name.length === 0 ?
                                                            'Ovdje će ići naslov nesukladnosti' :
                                                            fieldValues.name
                                                        }
                                                description=
                                                        {
                                                            fieldValues.description.length === 0 ?
                                                            'Ovdje će ići opis nesukladnosti' :
                                                            fieldValues.description
                                                        }>
                                            {{
                                                image:
                                                        fieldValues.image?.dataUrl ?
                                                        <Image dataUrl={fieldValues.image.dataUrl}/> :
                                                        'Ovdje će se nalaziti slika'
                                            }}
                                        </Nonconformity>
                            }
                };
            },
            [user]);

    const formOptions = React.useMemo(
            () =>
            {
                return {
                    defaultValues:
                            props.initialFormValues ??
                            {
                                name: '',
                                description: '',
                                image: null
                            } as FormValues
                };
            },
            [props.initialFormValues]);


    if (shouldReport(submitNonconformityResult, submitImageResult, isSubmitting))
        return (
                <div className="ion-padding">
                    <Report concat={[submitNonconformityResult, submitImageResult, isSubmitting]}>
                        {{
                            loadingText: 'Šaljem nesukladnost...',
                            progressIndicator: <IonProgressBar type="indeterminate"/>,
                            finalText: 'Završavam slanje...',
                            errorText: 'Dogodila se greška tokom slanja nesukladnosti...'
                        }}
                    </Report>
                </div>
        );


    // Don't memo this because it depends on a lot of things.
    // noinspection DuplicatedCode
    const submitAction = async (formValues: FormValues) =>
    {
        setIsSubmitting(true);

        let fetchImageResult;
        if (formValues.image?.dataUrl)
        {
            try
            {
                fetchImageResult = await submitImage(
                        {
                            variables: {
                                input: {
                                    image: formValues.image.dataUrl
                                }
                            }
                        });
            }
            catch (error)
            {
                alert(error);
            }
        }

        try
        {
            await submitNonconformity({
                variables: {
                    input: {
                        name: formValues.name,
                        description: formValues.description,
                        imageId: fetchImageResult?.data?.createImage.id
                    }
                }
            });
        }
        catch (error)
        {
            alert(error);
        }

        setIsSubmitting(false);
        
        props.afterSubmit();
    };


    // Don't memo this because it depends on a lot of things.
    return (
            <Forms.MultipartForm<FormValues>
                    formOptions={formOptions}
                    onSubmit={submitAction}>
                {formChildrenRender}
            </Forms.MultipartForm>
    );
};


export default React.memo(NonconformityMultipartForm);
