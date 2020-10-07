import React from 'react';
import { ReactElementWithSameProps } from '../../react/types';

import { IonCol, IonContent, IonFooter, IonGrid, IonRow } from '@ionic/react';
import { document } from 'ionicons/icons';

import { FormProvider, SubmitHandler, useForm, UseFormOptions } from 'react-hook-form';
import { FieldValues, UnpackNestedValue } from 'react-hook-form/dist/types/form';


import SubmitButton from '../SubmitButton';

import FormPartSwitchInternal, { toggleAlwaysName } from './FormPartSwitchInternal';
import FormPartSwitch from './FormPartSwitch';
import FormPartInternal from './FormPartInternal';
import FormPart from './FormPart';
import ErrorText from '../items/ErrorText';


// TODO: add group validation

type Parts =
        [
            ReactElementWithSameProps<typeof FormPart>,
            ...ReactElementWithSameProps<typeof FormPart>[]
        ];

interface Props<TFields extends FieldValues>
{
    formOptions?: Omit<UseFormOptions<TFields>, 'mode'>
    onSubmit: SubmitHandler<TFields>
    onPartChange?: (newPart: string | undefined) => void

    children:
            {
                parts: Parts,

                preview?:
                        {
                            part?: ReactElementWithSameProps<typeof FormPart>
                            renderOnOpen?: (fieldValues: UnpackNestedValue<TFields>) => React.ReactNode
                        }

                submitButton?: React.ReactComponentElement<typeof SubmitButton>
            }
}


type TogglePartMap = { [Key in string]?: ((() => void) | undefined) };

const registerTogglePart = (
        name: string,
        togglePart: () => void,
        togglePartMap: TogglePartMap) =>
{
    const toggleThisPart = togglePartMap[name];
    if (toggleThisPart)
    {
        // Clone the previous toggle so it doesn't end up being a recursive call.
        const prevToggle = toggleThisPart.bind({});
        togglePartMap[name] = () =>
        {
            prevToggle();
            togglePart();
        };
    }
    else
    {
        togglePartMap[name] = togglePart;
    }
};

const renderPart = (
        part: ReactElementWithSameProps<typeof FormPart>,
        openPart: React.MutableRefObject<string>,
        registerTogglePart: (togglePart: () => void) => void,
        renderOnOpen?: React.ComponentProps<typeof FormPartInternal>['renderOnOpen'],
        ...additionalChildren: React.ReactNode[]): React.ReactComponentElement<typeof FormPartInternal> =>

        <FormPartInternal
                user={part}

                openPart={openPart}
                registerTogglePart={registerTogglePart}

                renderOnOpen={renderOnOpen}>
            {additionalChildren}
        </FormPartInternal>;


const renderSwitch = (
        part: ReactElementWithSameProps<typeof FormPart>,
        openPart: React.MutableRefObject<string>,
        togglePart: TogglePartMap,
        registerTogglePart: (togglePart: () => void) => void) =>

        <FormPartSwitchInternal
                user=
                        {
                            part.props.switch ?
                            part.props.switch :
                            <FormPartSwitch>
                                {{
                                    icon: part.props.switchIcon
                                }}
                            </FormPartSwitch>
                        }

                name={part.props.name}

                openPart={openPart}
                togglePart={togglePart}
                registerTogglePart={registerTogglePart}/>;


const MultipartForm = <TFields extends FieldValues>(props: Props<TFields>) =>
{
    const propsPreviewPart = props.children.preview?.part;
    const propsParts = props.children.parts;
    const openPart = React.useMemo<React.MutableRefObject<string>>(
            () =>
            {
                for (const tab of propsParts) if (tab.props.openOnInit) return {current: tab.props.name};
                if (propsPreviewPart?.props.openOnInit) return {current: propsPreviewPart.props.name};
                return {current: propsParts[0].props.name};
            },
            [propsParts, propsPreviewPart]);

    const togglePartMap = React.useMemo<TogglePartMap>(
            () => { return {}; },
            // Needs to change when parts change.
            // eslint-disable-next-line
            [propsParts, propsPreviewPart]);
    const propsOnPartChange = props.onPartChange;
    // Layout because it might have an effect on rendering and its a lightweight operation.
    React.useLayoutEffect(
            () =>
            {
                if (propsOnPartChange)
                    togglePartMap[toggleAlwaysName] = () => propsOnPartChange(openPart.current);
            },
            [togglePartMap, propsOnPartChange, openPart]);


    const formPartsAndSwitchesRender = React.useMemo(
            () =>
                    propsParts.map(part =>
                    {
                        return {
                            part: renderPart(
                                    part,
                                    openPart,
                                    togglePart =>
                                            registerTogglePart(part.props.name, togglePart, togglePartMap)),
                            switch: renderSwitch(
                                    part,
                                    openPart,
                                    togglePartMap,
                                    togglePart =>
                                            registerTogglePart(part.props.name, togglePart, togglePartMap))
                        };
                    }),
            [propsParts, togglePartMap, openPart]);


    const propsSubmitButton = props.children.submitButton;
    // Memo because preview depends on it.
    const submitButtonRender = React.useMemo(
            () =>
                    propsSubmitButton ??
                    <SubmitButton>Završi</SubmitButton>,
            [propsSubmitButton]);
    const propsRenderOnOpen = props.children.preview?.renderOnOpen;
    // Memo because preview depends on it.
    const previewPart = React.useMemo(
            () =>
                    propsRenderOnOpen ?
                    (
                            propsPreviewPart ??
                            <FormPart name="Pregled"
                                      switchIcon={document}/>
                    ) :
                    null,
            [propsRenderOnOpen, propsPreviewPart]);

    const previewPartRender = React.useMemo(
            () =>
                    previewPart && propsRenderOnOpen &&
                    renderPart(
                            previewPart,
                            openPart,
                            togglePart =>
                                    registerTogglePart(previewPart.props.name, togglePart, togglePartMap),
                            propsRenderOnOpen,
                            <ErrorText/>,
                            <div className="ion-text-center">
                                {submitButtonRender}
                            </div>),
            // Lots of dependencies, but it could be a heavyweight component with pictures, so its worth memoizing.
            // All of these dependencies change only if the parts change and I don't expect of the user to
            // change them dinamically often.
            [togglePartMap, previewPart, propsRenderOnOpen, submitButtonRender, openPart]);
    const previewPartSwitchRender = React.useMemo(
            () =>
                    previewPart &&
                    renderSwitch(
                            previewPart,
                            openPart,
                            togglePartMap,
                            togglePart =>
                                    registerTogglePart(previewPart.props.name, togglePart, togglePartMap)),
            [togglePartMap, previewPart, openPart]);


    const formContext = useForm(
            {
                ...props.formOptions,
                mode: 'onChange'
            });

    return (
            <>
                <IonContent class="ion-padding">
                    <FormProvider {...formContext}>
                        <form onSubmit={formContext.handleSubmit(props.onSubmit)}>
                            {
                                formPartsAndSwitchesRender.map(part =>
                                        <React.Fragment key={part.part.props.user.props.name}>
                                            {part.part}
                                        </React.Fragment>)
                            }
                            {previewPartRender}
                        </form>
                    </FormProvider>
                </IonContent>
                <IonFooter>
                    <IonGrid>
                        <IonRow>
                            {
                                formPartsAndSwitchesRender.map(part =>
                                        <IonCol key={part.switch.props.name}>
                                            {part.switch}
                                        </IonCol>)
                            }
                            {
                                previewPartSwitchRender &&
                                <IonCol>
                                    {previewPartSwitchRender}
                                </IonCol>
                            }
                        </IonRow>
                        {
                            !propsRenderOnOpen &&

                            <IonRow class="ion-text-center">
                                <IonCol>
                                    {submitButtonRender}
                                </IonCol>
                            </IonRow>
                        }
                    </IonGrid>
                </IonFooter>
            </>
    );
};

// TODO: use React.memo when TS introduces higher kinded types
export default MultipartForm;
