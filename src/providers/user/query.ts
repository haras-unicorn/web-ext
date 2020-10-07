import { makeVar } from '@apollo/client';
import { TypePolicies } from '@apollo/client/cache/inmemory/policies';
import gql from 'graphql-tag';

export interface User
{
    id: string
    username: string;

    accessToken: string;
    refreshToken?: string;

    tokenExpiryDate: string;
}

export const user = makeVar<User | null | undefined>(undefined);

export const userTypePolicies: TypePolicies =
        {
            Query: {
                fields: {
                    User: () => user()
                }
            }
        };

export const READ_USER = gql`
    query User
    {
        User @client
    }
`;
