import gql from 'graphql-tag';

export const READ_USER_NONCONFORMITIES = gql`
    query ReadUserNonconformities
    {
        readUserNonconformities
        {
            id
            name
            description
            imageId
        }
    }
`;

export const READ_NONCONFORMITIES = gql`
    query ReadNonconformities
    {
        readNonconformities
        {
            apellant
            id
            name
            description
            imageId
        }
    }
`;

export interface NonconformityQueryResult
{
    apellant?: string
    id: string
    name: string
    description: string
    imageId: string
}
