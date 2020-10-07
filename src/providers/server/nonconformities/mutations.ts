import gql from 'graphql-tag';

export const CREATE_USER_NONCONFORMITY = gql`
    mutation CreateNonconformity($input: NonconformityInput!)
    {
        createUserNonconformity(input: $input)
        {
            name
            description
            imageId
        }
    }
`;

export const DELETE_USER_NONCONFORMITY = gql`
    mutation DeleteUserNonconformity($input: NonconformityReference!)
    {
        deleteUserNonconformity(input: $input)
        {
            name
            description
            imageId
        }
    }
`;

export const UPDATE_USER_NONCONFORMITY = gql`
    mutation UpdateUserNonconformity($input: NonconformityUpdate!)
    {
        updateUserNonconformity(input: $input)
        {
            name
            description
            imageId
        }
    }
`;

export interface NonconformityMutationResult
{
    name: string
    description: string
    imageId?: string
}
