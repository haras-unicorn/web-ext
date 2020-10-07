import React, { ReactElement } from 'react';
import { IonImg } from '@ionic/react';

import ImageFromId from './ImageFromIdView';
import ImageInMemory from './ImageInMemoryView';
import o from '../../../adapters/typescript/typedObject';


interface Props extends Omit<React.ComponentProps<typeof IonImg>, 'src'>
{
    imageId?: string
    dataUrl?: string
}

const ImageView: React.FC<Props> = (props: Props): ReactElement | null =>
{
    if (typeof props.dataUrl === 'string')
        return <ImageInMemory dataUrl={props.dataUrl} {...o.omit(props, 'imageId', 'dataUrl')}/>;

    if (typeof props.imageId === 'string')
        return <ImageFromId imageId={props.imageId} {...o.omit(props, 'imageId', 'dataUrl')}/>;

    return null;
};

export default React.memo(ImageView);
