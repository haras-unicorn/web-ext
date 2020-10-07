import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { IonInput, IonItem } from '@ionic/react';


import o from '../../typescript/typedObject';

import ErrorText, { isErrorText } from './ErrorText';
import ItemLabel from './ItemLabel';


interface IonicInputInjectionProps
{
    onIonChange?: (...event: any[]) => any,
    onIonBlur?: () => any,
    value?: any
}


type Props =
        {
            name: string;
            rules?: React.ComponentProps<typeof Controller>['rules'];

            children?:
                    {
                        input?: React.ReactElement<IonicInputInjectionProps>,
                        label?: React.ReactNode | string,
                        errorText?: React.ReactNode | boolean,
                        other?: React.ReactNode
                    }
        } &
        React.ComponentProps<typeof IonItem>


type ControllerRenderProps = Parameters<Exclude<React.ComponentProps<typeof Controller>['render'], undefined | null>>[0]

const Item: React.FC<Props> = (props: Props): React.ReactElement =>
{
    const formContext = useFormContext();


    const propsName = props.name;
    const propsRules = props.rules;
    const propsInput = props.children?.input;
    const controllerRender = React.useMemo(
            () =>
            {
                const renderInput =
                        ({onChange, onBlur, value}: ControllerRenderProps) =>
                                propsInput ?
                                React.cloneElement(
                                        propsInput,
                                        {
                                            onIonChange: onChange,
                                            onIonBlur: onBlur,
                                            value: value
                                        }) :
                                <IonInput onIonChange={onChange} onIonBlur={onBlur} value={value}/>;

                return <Controller name={propsName}
                                   rules={propsRules}
                                   render={renderInput}/>;
            },
            [propsInput, propsName, propsRules]);

    const propsError = props.children?.errorText;
    const errorTextRender = React.useMemo(
            () =>
                    propsError === undefined ?
                    null :
                    (
                            propsError === true ?
                            <ErrorText itemName={propsName}/> :
                            (
                                    propsError === false ?
                                    null :
                                    (
                                            isErrorText(propsError) ?
                                            React.cloneElement(
                                                    propsError,
                                                    {
                                                        itemName: propsName
                                                    }) :
                                            propsError
                                    )
                            )
                    ),
            [propsName, propsError]);

    const propsLabel = props.children?.label;
    const labelRender = React.useMemo(
            () =>
                    typeof propsLabel === 'string' ?
                    <ItemLabel>
                        {propsLabel}
                    </ItemLabel> :
                    propsLabel,
            [propsLabel]);


    return (
            <>
                <IonItem
                        {
                            ...o.omit(props, 'name', 'rules', 'children')
                        }
                        style={{
                            ...props.style,
                            // TODO: put colors in CSS
                            '--highlight-color-focused':
                                    propsName in formContext.formState.dirtyFields ?
                                    (
                                            formContext.errors[propsName] ?
                                            '#EB445A' :
                                            '#2DD36F'
                                    ) :
                                    '#3880FF'
                        }}>
                    {labelRender}
                    {controllerRender}
                    {props.children?.other}
                </IonItem>
                {errorTextRender}
            </>
    );
};

// Don't memo this - too many props to check.
export default Item;
