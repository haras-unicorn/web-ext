// noinspection JSUnusedGlobalSymbols
export type Dropper = | ElementModifier | ElementDropper

// noinspection JSUnusedGlobalSymbols
export type ElementModifier = Last
// noinspection JSUnusedGlobalSymbols
export type Last = 'last'

// noinspection JSUnusedGlobalSymbols
export type ElementDropper = Head | Tail | b.Index | b.Tuple<b.Index>
// noinspection JSUnusedGlobalSymbols
export type Head = 'head'
// noinspection JSUnusedGlobalSymbols
export type Tail = 'tail'

// noinspection JSUnusedGlobalSymbols
export type Drop<Drop, Any> =
        c.True<c.Requires<Drop, Dropper, 'union'>> extends true ?
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        DropInternal<Drop, Any> :

        never :
        c.Requires<Any, b.T> :
        c.Requires<Drop, Dropper, 'union'>


type DropIndices<Indices, Tuple> =
        f.Call<{
            [f.isEmpty]: b.EmptyT
            [f.isMaybeInfinite]: Tuple
            [f.isFinitelyIterable]:
                    {
                        [f.isSingular]: [c.Cast<Tuple, b.T>[c.Cast<a.Head<Indices>, number>]]
                        [f.hasSuffix]:
                                [
                                    c.Cast<Tuple, b.T>[c.Cast<a.Head<Indices>, number>],
                                    ...c.Cast<DropIndices<a.Suffix<Indices>, Tuple>, b.T>
                                ]
                    }
        }, Indices>

type DropElement<Acc, Any> =
        Acc extends 'head' ? a.Head<Any> :
        Acc extends 'tail' ? a.Tail<Any> :
                // Definately not infinitc.
                // @ts-ignore
        Acc extends b.IndexOf<Any> ? c.Cast<Any, b.T>[c.Cast<Acc, number>] :
        Acc extends b.Tuple<number> ? DropIndices<Acc, Any> :
        undefined;

type DropInternal<Acc, Any> =
        {
            recurse:
                    c.Not<c.IsNever<Extract<Acc, 'prefix'>>> extends true ?
                    DropInternal<Exclude<Acc, 'prefix'>, a.Prefix<Any>> :

                    c.Not<c.IsNever<Extract<Acc, 'suffix'>>> extends true ?
                    DropInternal<Exclude<Acc, 'suffix'>, a.Suffix<Any>> :

                    DropElement<Acc, Any>

            done: Any
        } [c.IsNever<Acc> extends true ? 'done' : 'recurse'];


import * as c from '../../core/coreTraits';


import * as b from './core/core/baseTupleTraits';
import * as f from './core/core/tupleFunction';

import * as a from './core/accessFunctions';


import environment from '../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
}
