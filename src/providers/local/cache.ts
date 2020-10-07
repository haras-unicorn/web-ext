import { Plugins } from '@capacitor/core';

import { ApolloCache, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { CachePersistor } from 'apollo-cache-persist';
import { PersistedData, PersistentStorage } from 'apollo-cache-persist/types';

import environment from '../../environments/active';
import { userTypePolicies } from '../user/query';


const CapacitorStorageAdapter: PersistentStorage<PersistedData<NormalizedCacheObject>> =
        {
            getItem: async (key: string) =>
            {
                const storageResult = await Plugins.Storage.get({key});
                return storageResult.value ? JSON.parse(storageResult.value) : null;
            },

            setItem: async (key: string, data: PersistedData<NormalizedCacheObject>) =>
                    await Plugins.Storage.set({
                        key: key,
                        value: typeof data === 'string' ? data : JSON.stringify(data)
                    }),

            removeItem: async (key: string) => await Plugins.Storage.remove({key: key})
        };


export function createCache()
{
    return new InMemoryCache({typePolicies: {...userTypePolicies}});
}

export function createCachePersistor(cache: ApolloCache<NormalizedCacheObject>):
        CachePersistor<PersistedData<NormalizedCacheObject>>
{
    return new CachePersistor<PersistedData<NormalizedCacheObject>>(
            {
                cache: cache,
                storage: CapacitorStorageAdapter,

                trigger: false,

                debug: environment.isDevelopment
            });
}
