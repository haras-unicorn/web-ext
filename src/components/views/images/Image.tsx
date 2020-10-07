import React from 'react';
import ImageView from './ImageView';
import o from '../../../adapters/typescript/typedObject';

interface Props extends React.ComponentProps<typeof ImageView>
{
    children?: React.ReactElement
}

const Image: React.FC<Props> = (props: Props) =>
        <div style={{'position': 'relative'}}>
            {
                props.children &&
                React.cloneElement(
                        props.children,
                        {
                            style: {
                                'position': 'absolute',
                                'top': '5px',
                                'right': '5px'
                            }
                        })
            }
            <ImageView {...o.omit(props, 'children')}/>
        </div>;

// Don't memo because you are risking checking the equality of dataUrl's.
export default Image;
