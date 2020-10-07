import React from 'react';

import FormPartSwitch from './FormPartSwitch';
import { IonIcon } from '@ionic/react';

interface Props
{
    name: string;
    openOnInit?: boolean;

    switch?: React.ReactComponentElement<typeof FormPartSwitch>
    switchIcon?: React.ReactComponentElement<typeof IonIcon> | string

    children?: React.ReactNode
}

// noinspection JSUnusedLocalSymbols
const FormPart: React.FC<Props> = (props: Props) => null;

export default React.memo(FormPart);
