import { useCallback } from 'react';

import { useQuery } from '@apollo/client';

import { READ_USER, User, user } from './query';


/*
 * Implemented to remove boilerplate of a lot of components using the user.
 */


export function useUserValue(): User | null
{
    const queryResult = useQuery<{ User: User }>(READ_USER);

    // Apollo memoizes query results, so you don't have to. :)
    // The UserPage is only undefined upon App load, so casting it to UserPage | null is legal.
    const user = queryResult?.data?.User as User | null;

    return user;
}

export function useUserUpdate(): (update: User | null) => User | null
{
    // The UserPage is only undefined upon App load, so casting it to UserPage | null is legal.
    return useCallback(
            (update: User | null) => user(update) as User | null,
            []);
}

export function useUser(): [ReturnType<typeof useUserValue>, ReturnType<typeof useUserUpdate>]
{
    return [useUserValue(), useUserUpdate()];
}
