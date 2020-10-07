import { Plugins } from '@capacitor/core';

import { ApolloClient } from '@apollo/client';


import environment from '../environments/active';

import { createServerLink } from './server/link';
import { createCache, createCachePersistor } from './local/cache';
import { User, user } from './user/query';


const cache = createCache();
const cachePersistor = createCachePersistor(cache);

export const createClient = () => new ApolloClient(
        {
            cache: cache,
            link: createServerLink(),

            credentials: environment.isDevelopment ? 'same-origin' : undefined,
            connectToDevTools: environment.isDevelopment
        });


const userKey = 'luser';

export async function restoreAppState()
{
    await cachePersistor.persist();

    const userString = (await Plugins.Storage.get({key: userKey})).value;
    user(typeof userString === 'string' ? JSON.parse(userString) as User : null);
}

export async function persistAppState()
{
    await cachePersistor.persist();
    await Plugins.Storage.set({key: userKey, value: JSON.stringify(user())});
}
