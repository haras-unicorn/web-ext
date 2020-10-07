import React, { useMemo } from 'react';

import { IonButton, IonIcon } from '@ionic/react';
import { remove } from 'ionicons/icons';
import { CameraPhoto, CameraResultType, Plugins } from '@capacitor/core';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import ErrorText, { isErrorText } from '../ErrorText';
import ImagePicker from './ImagePicker';
import Image from '../../../../components/views/images/Image';


type IonButtonOnIonBlurEvent =
        Parameters<Exclude<React.ComponentProps<typeof IonButton>['onIonBlur'], undefined | null>>[0]

type IonButtonOnClickEvent =
        Parameters<Exclude<React.ComponentProps<typeof IonButton>['onClick'], undefined | null>>[0]

type ControllerRenderProps =
        Parameters<Exclude<React.ComponentProps<typeof Controller>['render'], undefined | null>>[0]

interface IonicImagePickerInjectionProps
{
    onIonBlur?: (event: IonButtonOnIonBlurEvent) => any
    onClick?: (event: IonButtonOnClickEvent) => any
}

interface IonicImageRemoverInjectionProps
{
    onClick?: (event: IonButtonOnClickEvent) => any
    color?: string
}


type Props =
        {
            name: string
            required?: boolean

            children?:
                    {
                        imagePicker?: React.ReactElement<IonicImagePickerInjectionProps>,
                        imageRemover?: React.ReactElement<IonicImageRemoverInjectionProps>,
                        errorText?: React.ReactNode | boolean,
                        other?: React.ReactNode
                    }

            renderImage?: (dataUrl: string, children: React.ReactElement) => React.ReactElement
        }


const ImageItem: React.FC<Props> = (props: Props): React.ReactElement =>
{
    const formContext = useFormContext();


    const propsImagePicker = props.children?.imagePicker;
    const propsName = props.name;
    const propsRequired = props.required;
    const controllerRender = useMemo(
            () =>
            {
                const renderImagePicker =
                        ({onChange, onBlur}: ControllerRenderProps) =>
                        {
                            const onIonBlur = (event: IonButtonOnIonBlurEvent) =>
                            {
                                onBlur();

                                if (propsImagePicker?.props.onIonBlur)
                                    propsImagePicker?.props.onIonBlur(event);
                            };

                            const onClick = async (event: IonButtonOnClickEvent) =>
                            {
                                onChange(await Plugins.Camera.getPhoto({
                                    quality: 50,
                                    height: 1000,
                                    width: 1000,

                                    allowEditing: true,
                                    resultType: CameraResultType.DataUrl
                                }));

                                if (propsImagePicker?.props.onClick)
                                    propsImagePicker.props.onClick(event);
                            };

                            return propsImagePicker ?
                                   React.cloneElement(
                                           propsImagePicker,
                                           {
                                               onIonBlur: onIonBlur,
                                               onClick: onClick
                                           }
                                   ) :
                                   <ImagePicker onIonBlur={onIonBlur}
                                                onClick={onClick}>
                                       Dodaj sliku...
                                   </ImagePicker>;
                        };

                return <Controller name={propsName}
                                   render={renderImagePicker}
                                   rules={propsRequired ? {required: true} : undefined}/>;
            },
            [propsImagePicker, propsName, propsRequired]);

    const propsImageRemover = props.children?.imageRemover;
    const formSetValue = formContext.setValue;
    const imageRemoverRender = useMemo(
            () =>
            {
                const onClick = (event: IonButtonOnClickEvent) =>
                {
                    formSetValue(propsName, null);
                    if (propsImageRemover?.props.onClick)
                        propsImageRemover.props.onClick(event);
                };

                const color = propsImageRemover?.props.color ?? 'danger';

                return propsImageRemover ?
                       React.cloneElement(
                               propsImageRemover,
                               {
                                   onClick: onClick,
                                   color: color
                               }) :
                       <IonButton onClick={onClick} color={color}>
                           <IonIcon icon={remove}/>
                       </IonButton>;
            },
            [formSetValue, propsName, propsImageRemover]);

    // useWatch always copies (sadness) the result into a new map, so don't memo this.
    const image = useWatch<CameraPhoto | null>({
        name: props.name,
        defaultValue: null
    });
    const propsRenderImage = props.renderImage;
    const imageRender =
                    image?.dataUrl ?
                    (
                            propsRenderImage ?
                            propsRenderImage(image.dataUrl, imageRemoverRender) :
                            <Image dataUrl={image.dataUrl}>
                                {imageRemoverRender}
                            </Image>
                    ) :
                    null;

    const propsError = props.children?.errorText;
    const errorTextRender = useMemo(
            () =>
                    propsError === undefined ?
                    null :
                    (
                            propsError === true ?
                            <ErrorText/> :
                            (
                                    propsError === false ?
                                    null :
                                    (
                                            isErrorText(propsError) ?
                                            React.cloneElement(
                                                    propsError,
                                                    {
                                                        itemName: propsName
                                                    }) :
                                            propsError
                                    )
                            )
                    ),
            [propsName, propsError]);


    return (
            <>
            <div className="ion-text-center">
                {controllerRender}
                {imageRender}
            </div>
            {errorTextRender}
            {props.children?.other}
            </>
    );
};

export default React.memo(ImageItem,
        (
                prevProps,
                nextProps) =>
        {
            return prevProps.name === nextProps.name &&
                   prevProps.required === nextProps.required &&

                   prevProps.renderImage === nextProps.renderImage &&
                   prevProps.children?.errorText === nextProps.children?.errorText &&
                   prevProps.children?.imagePicker === nextProps.children?.imagePicker &&
                   prevProps.children?.imageRemover === nextProps.children?.imageRemover &&
                   prevProps.children?.other === nextProps.children?.other;
        });
