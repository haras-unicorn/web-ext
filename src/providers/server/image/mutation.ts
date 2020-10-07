import gql from 'graphql-tag';

import environment from '../../../environments/active';


export const CREATE_IMAGE = gql`
    mutation CreateImage($input: ImageInput!)
    {
        createImage(input: $input) @rest(
            type: "String",
            path: "${
    environment.restApiRoutes.Image.Route}${
    environment.restApiRoutes.Image.Actions.PostWithoutId
    }",
            method: "POST",
            bodySerializer: "multipartDataUrl")
        {
            id
        }
    }
`;

export const UPDATE_IMAGE = gql`
    mutation UpdateImage($input: ImageInput!, $id: String!)
    {
        updateImage(input: $input, id: $id) @rest(
            type: "String",
            path: "${environment.restApiRoutes.Image.Actions.Put.replace('{id}', '{args.id}')}",
            endpoint: "images",
            method: "PUT",
            bodySerializer: "multipartDataUrl")
    }
`;

export const DELETE_IMAGE = gql`
    mutation DeleteImage($id: String!)
    {
        deleteImage(id: $id) @rest(
            type: "String",
            path: "${environment.restApiRoutes.Image.Actions.Delete.replace('{id}', '{args.id}')}",
            endpoint: "images",
            method: "DELETE")
    }
`;
