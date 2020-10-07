import React from 'react';
import { IonButton } from '@ionic/react';
import o from '../../../typescript/typedObject';

type Props =
        {
            children?: React.ReactNode
        } &
        Omit<React.ComponentProps<typeof IonButton>, 'type'>

const ImagePicker: React.FC<Props> = (props: React.PropsWithChildren<Props>) =>
{
    return (
            <IonButton {...o.omit(props, 'children')} type="button">
                {props.children}
            </IonButton>
    );
};

export default React.memo(ImagePicker);
