import React from 'react';
import { IonImg } from '@ionic/react';
import o from '../../../adapters/typescript/typedObject';

type Props =
        {
            dataUrl: string
        } & Omit<React.ComponentProps<typeof IonImg>, 'src'>

const ImageInMemory: React.FC<Props> = (props: Props) =>
        <IonImg {...o.omit(props, 'dataUrl')} src={props.dataUrl}/>;

// Don't memo because you don't want to check if two dataUrl's are equal.
export default ImageInMemory;
