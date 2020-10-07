import React from 'react';
import { IonImg, IonSpinner } from '@ionic/react';
import { useQuery } from '@apollo/client';

import o from '../../../adapters/typescript/typedObject';
import { READ_IMAGE } from '../../../providers/server/image/query';
import Report, { shouldReport } from '../../../providers/Report';


type Props =
        {
            imageId: string;
        } & Omit<React.ComponentProps<typeof IonImg>, 'src'>

const ImageFromId: React.FC<Props> = (props: Props) =>
{
    const image = useQuery<{ readImage: string }, { id: string }>(
            READ_IMAGE,
            {
                variables: {id: props.imageId}
            });


    if (shouldReport(image))
        return (
                <Report concat={[image]}>
                    {{
                        loadingText: 'Dohvaćam sliku...',
                        errorText: 'Dogodila se greška tokom dohvaćanja slike.',
                        progressIndicator:
                                <div className="ion-text-center">
                                    <IonSpinner name="crescent"/>
                                </div>,
                        finalText: 'Završavam s dohvaćanjem slike.'
                    }}
                </Report>
        );

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
    if (image.data?.readImage) return (
            <IonImg {...o.omit(props, 'imageId')}
                    src={image.data.readImage}/>
    );

    return null;
};


export default React.memo(ImageFromId);
