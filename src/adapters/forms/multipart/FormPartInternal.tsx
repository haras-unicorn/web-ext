import React from 'react';
import { ReactElementWithSameProps } from '../../react/types';
import { useFormContext } from 'react-hook-form';

import FormPart from './FormPart';


interface Props
{
    user: ReactElementWithSameProps<typeof FormPart>

    openPart: React.MutableRefObject<string>,
    registerTogglePart: (togglePart: () => void) => void;

    renderOnOpen?: (fieldValues: any) => React.ReactNode
    children?: React.ReactNode
}

const FormPartInternal = (props: React.PropsWithChildren<Props>) =>
{
    const [isOpen, setIsOpen] = React.useState<boolean>(
            props.openPart.current === props.user.props.name);

    const propsRegisterTogglePart = props.registerTogglePart;
    // It's lightweight and it could mess with the UI.
    React.useLayoutEffect(
            () =>
            {
                propsRegisterTogglePart(() => setIsOpen(prevOpen => !prevOpen));
            },
            [propsRegisterTogglePart]);

    const formContext = useFormContext();


    // I'm not expecting the user to change the render quicker than they open this part, so no memo.
    const onOpenRender = isOpen && props.renderOnOpen && props.renderOnOpen(formContext.getValues());

    // I'm not expecting the user to change the children quicker than they open this part, so no memo.
    const hiddenRender =
            <div style={{display: isOpen ? 'block' : 'none'}}>
                {props.user.props.children}
                {props.children}
            </div>;


    return (
            <>
                {onOpenRender}
                {hiddenRender}
            </>
    );
};

export default React.memo(FormPartInternal);
