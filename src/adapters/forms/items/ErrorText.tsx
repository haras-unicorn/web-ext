import React from 'react';
import { IonText } from '@ionic/react';
import { useFormContext } from 'react-hook-form';
import o from '../../typescript/typedObject';
import q from '../../typescript/queryable';

type Props =
        {
            itemName?: string

            children?: React.ReactNode
        } &
        React.ComponentProps<typeof IonText>

// TODO: fix error with keys
const ErrorText: React.FC<Props> = (props: React.PropsWithChildren<Props>) =>
{
    const formContext = useFormContext();

    return props.itemName ?
           (
                   // TODO: put this in another component that memoizes for certain fields.
                   formContext.errors && formContext.errors[props.itemName] ?
                   <IonText color="danger"
                            {...props}>
                       <p>
                           {formContext.errors[props.itemName].message}
                       </p>
                       {props.children}
                   </IonText> :
                   null
           ) :
           <IonText color="danger" {...o.omit(props, 'itemName', 'children')}>
               {
                   q(o.entries(formContext.errors))
                           .map(error => <p key={error[0]}>{error[1].message}</p>)
                           .toArray()
               }
               {props.children}
           </IonText>;
};

export default React.memo(ErrorText);

export const isErrorText = (test: React.ReactNode): test is React.ReactComponentElement<typeof ErrorText> =>
        (test as React.ReactElement)?.props?.itemName !== undefined;
