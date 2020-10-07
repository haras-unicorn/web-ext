import { ApolloLink, from, GraphQLRequest } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { setContext } from '@apollo/client/link/context';
import { RestLink } from 'apollo-link-rest';


import environment from '../../environments/active';

import { user } from '../user/query';
import { FileReaderAsync } from '../../adapters/fileReaderAsync';


const createAltiBizAuthorizationLink = () => setContext((request: GraphQLRequest, {headers}: any): any =>
        Object(
                {
                    headers: user()?.accessToken ?
                            {
                                ...headers,
                                Authorization: `${environment.apiSettings.Authorization.Scheme} ${user()?.accessToken}`
                            } :
                            {
                                ...headers
                            }
                }));

// noinspection JSUnusedGlobalSymbols
const createAltiBizRestLink = () => new RestLink(
        {
            uri: environment.apiSettings.Host.ApplicationUrl,

            endpoints: {
                images: {
                    uri: environment.apiSettings.Host.ApplicationUrl + environment.restApiRoutes.Image.Route,
                    responseTransformer: async (data: Response, _: string): Promise<string | undefined> =>
                            data?.blob && await new FileReaderAsync().readAsDataUrlAsync(await data.blob())
                }
            },

            bodySerializers: {
                form: (data: any, headers: Headers) =>
                {
                    // Stack overflow. Yes.
                    const formBody =
                            Object.keys(data)
                                  .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
                                  .join('&');

                    headers.set('Content-Type', 'application/x-www-form-urlencoded');

                    return {body: formBody, headers: headers};
                },
                // https://github.com/apollographql/apollo-link-rest/issues/200#issuecomment-509287597
                multipart: (data: any, headers: Headers) =>
                {
                    const formData = new FormData();
                    Object.keys(data)
                          .forEach(key => formData.append(key, data[key]));

                    headers.set('Accept', '*/*');

                    return {body: formData, headers};
                },
                multipartDataUrl: (data: any, headers: Headers) =>
                {
                    const fileReader = new FileReaderAsync();
                    const formData = new FormData();
                    for (const key of Object.keys(data))
                    {
                        const file = fileReader.toBlob(data[key]);
                        formData.append(key, file);
                    }

                    headers.set('Accept', '*/*');

                    return {body: formData, headers};
                }
            }
        });

const createAltiBizGraphQlLink = () => new HttpLink(
        {
            uri: environment.apiSettings.Host.ApplicationUrl + environment.apiSettings.GraphQl.SchemaRoute
        });

export function createServerLink(): ApolloLink
{
    return from([
        createAltiBizAuthorizationLink(),
        createAltiBizRestLink(),
        createAltiBizGraphQlLink()
    ]);
}
