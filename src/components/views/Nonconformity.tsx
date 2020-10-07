import React from 'react';

import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonRow } from '@ionic/react';


interface Props
{
    apellant?: string
    name: string
    description: string
    children?:
            {
                image?: React.ReactNode
                button?: React.ReactNode
                other?: React.ReactNode
            }
}


const Nonconformity: React.FC<Props> = (props: Props) =>
{
    const propsButton = props.children?.button;
    const buttonRender = React.useMemo(
            () =>
                    propsButton &&
                    (
                            (propsButton as React.ReactElement).props === undefined ?
                            propsButton :
                            React.cloneElement(
                                    (propsButton as React.ReactElement),
                                    {
                                        style: {
                                            float: 'right'
                                        }
                                    })
                    ),
            [propsButton]);

    const propsImage = props.children?.image;
    const imageRender = React.useMemo(
            () =>
                    propsImage &&
                    (
                            (propsImage as React.ReactElement).props === undefined ?
                            propsImage :
                            React.cloneElement(
                                    propsImage as React.ReactElement,
                                    {
                                        style: {
                                            height: '300px'
                                        }
                                    })
                    ),
            [propsImage]);

    return (
            <IonCard>
                <IonCardHeader>
                    {buttonRender}
                    <IonRow className="ion-text-center">
                        <IonCol>
                            {imageRender}
                        </IonCol>
                    </IonRow>
                    <IonCardTitle>
                        {props.name}
                    </IonCardTitle>
                    {
                        props.apellant ?
                        <IonCardSubtitle>{props.apellant}</IonCardSubtitle> :
                        null
                    }
                </IonCardHeader>
                <IonCardContent>
                    {
                        // No memo because the description could be long
                        // React complains about keys and you aren't supposed to set keys by index but oh well...
                        props.description
                             .split('\n')
                             .map((paragraph, index) =>
                                     <p key={index}>{paragraph}</p>)
                    }
                    {
                        props.children?.other
                    }
                </IonCardContent>
            </IonCard>
    );
};

// Don't memo because the description could be long.
export default Nonconformity;
