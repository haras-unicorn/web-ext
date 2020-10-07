import React from 'react';
import { IonIcon } from '@ionic/react';

interface Props
{
    children?:
            {
                icon?: React.ReactComponentElement<typeof IonIcon> | string
                label?: React.ReactNode

                other?: React.ReactNode
            }
}

// noinspection JSUnusedLocalSymbols
const FormPartSwitch: React.FC<Props> = (props: React.PropsWithChildren<Props>) => null;

export default React.memo(FormPartSwitch,
        (
                prevProps,
                nextProps) =>
        {
            return prevProps.children?.icon === nextProps.children?.icon &&
                   prevProps.children?.label === nextProps.children?.label &&
                   prevProps.children?.other === nextProps.children?.other;
        });
