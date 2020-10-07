import React, { useMemo } from 'react';

import { IonButton, IonInput, IonProgressBar, IonTextarea } from '@ionic/react';
import { CameraPhoto } from '@capacitor/core';

import { useMutation } from '@apollo/client';


import { CREATE_IMAGE } from '../../providers/server/image/mutation';
import Report, { shouldReport } from '../../providers/Report';

import * as Forms from '../../adapters/forms/Forms';

import Image from '../views/images/Image';
import { CREATE_USER_NONCONFORMITY } from '../../providers/server/nonconformities/mutations';


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
const NonconformityForm: React.FC<Props> = (props: Props) =>
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
                fetchPolicy: 'no-cache'
            });


    const nameItem = React.useMemo(
            () =>
                    <Forms.Item name="name"
                                rules={{required: 'Naziv je potreban.'}}>
                        {{
                            label:
                                    <Forms.ItemLabel position="fixed">
                                        'Naziv'
                                    </Forms.ItemLabel>,

                            input: <IonInput type="text"
                                             autofocus
                                             inputmode="text"
                                             placeholder="Naziv nesukladnosti ovdje"/>,

                            errorText: <Forms.ErrorText/>
                        }}
                    </Forms.Item>,
            []);

    const descriptionItem = useMemo(
            () =>
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

                            errorText: <Forms.ErrorText/>
                        }}
                    </Forms.Item>,
            []);

    const imageItem = useMemo(
            () =>
                    <Forms.ImageItem name="image"

                                     renderImage={
                                         (dataUrl, children) =>
                                                 <Image dataUrl={dataUrl}>
                                                     {children}
                                                 </Image>
                                     }>
                        {{
                            imagePicker:
                                    <Forms.ImagePicker fill="solid">
                                        Dodaj sliku...
                                    </Forms.ImagePicker>,

                            imageRemover: <IonButton/>
                        }}
                    </Forms.ImageItem>,
            []);


    const initialFormValues = React.useMemo(
            () =>
                    props.initialFormValues ??
                    {
                        name: '',
                        description: '',
                        image: null
                    } as FormValues,
            [props.initialFormValues]);


    if (shouldReport(submitNonconformityResult, submitImageResult, isSubmitting))
        return (
                <Report concat={[submitNonconformityResult, submitImageResult, isSubmitting]}>
                    {{
                        loadingText: 'Šaljem nesukladnost...',
                        progressIndicator: <IonProgressBar type="indeterminate"/>,
                        finalText: 'Završavam slanje...',
                        errorText: 'Dogodila se greška tokom slanja nesukladnosti...'
                    }}
                </Report>
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

        props.afterSubmit();

        setIsSubmitting(false);
    };


    // Don't memo this because it depends on a lot of things.
    return (
            <Forms.Form<FormValues>
                    formOptions={{defaultValues: initialFormValues}}
                    onSubmit={submitAction}
                    submitButton=
                            {
                                <Forms.SubmitButton fill="outline" expand="full">
                                    Dodaj nesukladnost
                                </Forms.SubmitButton>
                            }>
                {nameItem}
                {descriptionItem}
                {imageItem}
            </Forms.Form>
    );
};

// noinspection JSUnusedGlobalSymbols
export default React.memo(NonconformityForm);
