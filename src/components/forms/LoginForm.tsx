import React from 'react';
import { useHistory } from 'react-router-dom';

import { IonInput, IonProgressBar } from '@ionic/react';

import { useMutation } from '@apollo/client';
import {
    AUTHENTICATE,
    AuthenticateInput,
    AuthenticateParameters,
    AuthenticateResult,
    mapAuthenticateParamsToInput,
    mapAuthenticateResultToUser
} from '../../providers/server/authentication/query';
import Report, { shouldReport } from '../../providers/Report';

import { useUserUpdate } from '../../providers/user/hooks';

import * as Forms from '../../adapters/forms/Forms';


interface Props
{
    redirectOnLogin: string
}

interface LoginFormValues extends AuthenticateParameters {}

const initialLoginFormValues: LoginFormValues =
        {
            username: '',
            password: ''
        };


const LoginForm: React.FC<Props> = (props: React.PropsWithChildren<Props>) =>
{
    const history = useHistory();
    const [isLoggingIn, setIsLoggingIn] = React.useState<boolean>(false);

    const [authenticate, authenticateResult] = useMutation<{ authenticate: AuthenticateResult },
            { input: AuthenticateInput }>(
            AUTHENTICATE,
            {
                fetchPolicy: 'no-cache'
            });

    const updateUser = useUserUpdate();


    const usernameItemRender = React.useMemo(
            () =>
                    <Forms.Item name="username"
                                rules={{required: 'Korisničko ime je potrebno za prijavu.'}}>
                        {{
                            label:
                                    <Forms.ItemLabel position="fixed">
                                        Korisnik
                                    </Forms.ItemLabel>,

                            input: <IonInput type='text'
                                             autocomplete='username'
                                             autofocus
                                             inputmode="text"
                                             placeholder="Vaše korisničko ime ovdje"/>,

                            errorText: true
                        }}
                    </Forms.Item>,
            []);

    const passwordItemRender = React.useMemo(
            () =>
                    <Forms.Item name="password"
                                rules={{
                                    required: 'Lozinka je potrebna za prijavu.',
                                    minLength:
                                            {
                                                value: 4,
                                                message: 'Lozinka ne smije biti kraća od 4 znaka.'
                                            },
                                    maxLength:
                                            {
                                                value: 32,
                                                message: 'Lozinka ne smije biti dulja od 32 znaka.'
                                            }
                                }}>
                        {{
                            label:
                                    <Forms.ItemLabel position="fixed">
                                        Lozinka
                                    </Forms.ItemLabel>,

                            input: <IonInput type="password"
                                             autocomplete="current-password"
                                             clearInput
                                             clearOnEdit
                                             inputmode="text"
                                             placeholder="Vaša lozinka ovdje"/>,

                            errorText: true
                        }}
                    </Forms.Item>,
            []);


    if (shouldReport(authenticateResult, isLoggingIn))
        return (
                <Report concat={[authenticateResult, isLoggingIn]}>
                    {{
                        loadingText: 'Šaljem podatke serveru...',
                        errorText: 'Dogodila se greška tokom prijave...',
                        progressIndicator: <IonProgressBar type="indeterminate"/>,
                        finalText: 'Prijavljujem...'
                    }}
                </Report>
        );


    // Don't memo this because it depends on a lot of things.
    const submitAction = async (loginFormValues: LoginFormValues): Promise<void> =>
    {
        setIsLoggingIn(true);
        let authenticateResult;

        try
        {
            authenticateResult = await authenticate({
                variables: {input: mapAuthenticateParamsToInput(loginFormValues)}
            });
        }
        catch (error)
        {
            alert(error);
        }

        if (authenticateResult?.data?.authenticate)
        {
            updateUser(mapAuthenticateResultToUser(authenticateResult.data.authenticate));
            history.push(props.redirectOnLogin);
        }
    };

    // Don't memo this because it depends on a lot of things.
    return (
            <Forms.Form<LoginFormValues>
                    formOptions={{defaultValues: initialLoginFormValues}}
                    onSubmit={submitAction}
                    submitButton=
                            {
                                <Forms.SubmitButton fill="outline" expand="full">
                                    Prijavi se
                                </Forms.SubmitButton>
                            }>
                {usernameItemRender}
                {passwordItemRender}
            </Forms.Form>
    );
};

export default React.memo(LoginForm);
