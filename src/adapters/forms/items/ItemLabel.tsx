import React from 'react';
import { IonLabel } from '@ionic/react';
import o from '../../typescript/typedObject';

type Props =
        {
            children?: React.ReactNode
        } & React.ComponentProps<typeof IonLabel>

const ItemLabel: React.FC<Props> = (props: React.PropsWithChildren<Props>) =>
{
    return (
            <IonLabel {...o.omit(props, 'children')}>
                {props.children}
            </IonLabel>
    );
};

export default React.memo(ItemLabel);
