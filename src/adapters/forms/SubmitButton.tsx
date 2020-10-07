import React from 'react';
import { IonButton } from '@ionic/react';
import { useFormContext } from 'react-hook-form';

type Props =
        {
            children: React.ReactText,
        } &
        Omit<React.ComponentProps<typeof IonButton>, 'type' | 'disabled'>

const SubmitButton: React.FC<Props> = (props: Props) =>
{
    const formContext = useFormContext();

    return (
            <IonButton {...props}
                       disabled={!formContext.formState.isValid && formContext.formState.isSubmitted}
                       type="submit">
                {props.children}
            </IonButton>
    );
};

// Don't memo - too many props to check for something this lightweight.
export default SubmitButton;
