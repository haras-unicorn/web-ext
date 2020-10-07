import React from 'react';
import { ReactElementWithSameProps } from '../../react/types';
import { IonIcon, IonTabButton, IonText } from '@ionic/react';

import FormPartSwitch from './FormPartSwitch';
import ItemLabel from '../items/ItemLabel';


interface Props
{
    user: ReactElementWithSameProps<typeof FormPartSwitch>

    name: string

    openPart: React.MutableRefObject<string>,
    togglePart: { [Key in string]?: ((() => void) | undefined) },
    registerTogglePart: (togglePart: () => void) => void;
}

export const toggleAlwaysName = '__always';

const FormPartSwitchInternal: React.FC<Props> = (props: Props) =>
{
    const propsName = props.name;
    const [isPartOpen, setIsPartOpen] = React.useState(props.openPart.current === propsName);

    const propsRegisterTogglePart = props.registerTogglePart;
    // It's lightweight and it could mess with the UI.
    React.useLayoutEffect(
            () =>
            {
                propsRegisterTogglePart(() => setIsPartOpen(prevOpen => !prevOpen));
            },
            [propsRegisterTogglePart]);


    // I'm not expecting the user to change the icon quicker than he opens this part, so no memo.
    const propsIcon = props.user.props.children?.icon;
    const iconRender =
            propsIcon ?
            (
                    typeof propsIcon === 'string' ?
                    <IonIcon icon={propsIcon} color={isPartOpen ? 'primary' : undefined}/> :
                    React.cloneElement(
                            propsIcon,
                            {
                                color: isPartOpen ? 'primary' : undefined
                            })
            ) :
            null;

    // I'm not expecting the user to change the label quicker than he opens this part, so no memo.
    const propsLabel = props.user.props?.children?.label;
    const labelRender =
            propsLabel ?
            (
                    (propsLabel as React.ReactElement)?.props === undefined ?
                    propsLabel :
                    React.cloneElement(
                            (propsLabel as React.ReactElement),
                            {},
                            <IonText color={isPartOpen ? 'primary' : undefined}>
                                {(propsLabel as React.ReactElement)?.props?.children ?? propsName}
                            </IonText>)
            ) :
            <ItemLabel color={isPartOpen ? 'primary' : undefined}>
                {propsName}
            </ItemLabel>;


    const propsTogglePart = props.togglePart;
    const propsOpenPart = props.openPart;
    const onClick = React.useCallback(
            () =>
            {
                const toggleCurrentPart = propsTogglePart[propsOpenPart.current];
                toggleCurrentPart && toggleCurrentPart();

                const toggleThisPart = propsTogglePart[propsName];
                toggleThisPart && toggleThisPart();

                propsOpenPart.current = propsName;

                const toggleAlways = propsTogglePart[toggleAlwaysName];
                toggleAlways && toggleAlways();
            },
            [propsTogglePart, propsName, propsOpenPart]);


    return (
            <IonTabButton tab={propsName}
                          onClick={onClick}>
                {iconRender}
                {labelRender}
                {props.user.props.children?.other}
            </IonTabButton>
    );
};


export default React.memo(FormPartSwitchInternal);
