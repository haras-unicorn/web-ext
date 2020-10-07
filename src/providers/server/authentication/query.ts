import gql from 'graphql-tag';

import jwt from 'jsonwebtoken';

import environment from '../../../environments/active';
import { User } from '../../user/query';


// Per the OAuth2.0 spec
export interface AuthenticateInput
{
    client_id?: string
    client_secret?: string

    grant_type: string

    username: string
    password: string

    scope?: string
}

export interface AuthenticateResult
{
    access_token: string;
    token_type: string;

    expires_in: number;

    refresh_token?: string;

    scope?: string;
}

export const AUTHENTICATE = gql`
    mutation Authenticate($input: AuthenticateInput!)
    {
        authenticate(input: $input) @rest(
            type: "AuthenticateResult"
            path: "${environment.apiSettings.Authentication.TokenRoute}"
            method: "POST"
            bodySerializer: "form")
        {
            access_token
            token_type

            expires_in

            refresh_token
        }
    }
`;


export interface AuthenticateParameters
{
    username: string;
    password: string;
}

export function mapAuthenticateParamsToInput(
        parameters: AuthenticateParameters): AuthenticateInput
{
    return {
        client_id: environment.apiSettings.Identity.ClientAppId,
        client_secret: environment.apiSettings.Identity.ClientAppSecret,

        grant_type: 'password',

        username: parameters.username,
        password: parameters.password,

        // Standard scopes
        scope: `openid profile email ` +
               `${environment.apiSettings.Identity.AuthorizationApiId} ` +
               `${environment.apiSettings.Identity.RestApiId} ` +
               `${environment.apiSettings.Identity.GraphQlApiId}`
    } as AuthenticateInput;
}


interface BaseDecodedAccessTokenModel
{
    nbf: number;
    exp: number;
    auth_time: number;

    iss: string;
    idp: string;
    aud: string | string[];
    client_id: string;

    scope: string | string[];
    amr: string[];
}

interface DecodedAccessTokenModel extends BaseDecodedAccessTokenModel
{
    name: string;
    sub: string;
}

// TODO: fix usernamename undefined - scope maybe?
export function mapAuthenticateResultToUser(data: AuthenticateResult): User
{
    const loginDecodedAccessToken = jwt.decode(
            data.access_token
    ) as DecodedAccessTokenModel;

    const tokenExpiryDate = new Date();
    tokenExpiryDate.setSeconds(
            tokenExpiryDate.getSeconds() + data.expires_in);

    return {
        id: loginDecodedAccessToken.sub,
        username: loginDecodedAccessToken.name,

        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        tokenType: data.token_type,

        tokenExpiryDate: tokenExpiryDate.toISOString()
    } as User;
}
