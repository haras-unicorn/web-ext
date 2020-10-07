import gql from 'graphql-tag';


import environment from '../../../environments/active';


export const READ_IMAGE = gql`
    query ReadImage($id: String!)
    {
        readImage(id: $id) @rest(
            type: "Image",
            path: "${environment.restApiRoutes.Image.Actions.Get.replace('{id}', '{args.id}')}",
            endpoint: "images",
            method: "GET")
    }
`;
