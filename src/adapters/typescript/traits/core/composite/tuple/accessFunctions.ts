// noinspection JSUnusedGlobalSymbols
export type Accessor = TupleAccessor | ElementModifier | ElementAccessor | TupleConstructor

// noinspection JSUnusedGlobalSymbols
export type TupleAccessor = Prefix | Suffix
// noinspection JSUnusedGlobalSymbols
export type Prefix = 'prefix'
// noinspection JSUnusedGlobalSymbols
export type Suffix = 'suffix'

// noinspection JSUnusedGlobalSymbols
export type TupleConstructor = b.Tuple<ElementModifier | ElementAccessor>;

// noinspection JSUnusedGlobalSymbols
export type ElementModifier = First | Last
// noinspection JSUnusedGlobalSymbols
export type First = 'first'
// noinspection JSUnusedGlobalSymbols
export type Last = 'last'

// noinspection JSUnusedGlobalSymbols
export type ElementAccessor = Head | Tail | b.Index
// noinspection JSUnusedGlobalSymbols
export type Head = 'head'
// noinspection JSUnusedGlobalSymbols
export type Tail = 'tail'

// noinspection JSUnusedGlobalSymbols
export type Get<Acc, Any> =
        c.True<c.Requires<Acc, Accessor, 'union'>> extends true ?
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        GetInternal<Acc, Any> :

        never :
        c.Requires<Any, b.T> :
        c.Requires<Acc, Accessor, 'union'>


type GetInternal<Acc, Any> =
        {
            recurse:
                    u.Has<Acc, Prefix> extends true ?
                    GetPrefix<Acc, Any> :

                    u.Has<Acc, Suffix> extends true ?
                    GetSuffix<Acc, Any> :

                    u.Has<Acc, First> extends true ?
                    GetFirst<Acc, Any> :

                    u.Has<Acc, Last> extends true ?
                    GetLast<Acc, Any> :

                    GetAt<Acc, Any>

            done: Any
        } [c.IsNever<Acc> extends true ? 'done' : 'recurse'];


type GetPrefix<Acc, Any> = GetInternal<Exclude<Acc, Prefix>, a.Prefix<Any>>

type GetSuffix<Acc, Any> = GetInternal<Exclude<Acc, Suffix>, a.Suffix<Any>>

type GetFirst<Acc, Any> =
        c.Loosely<u.Has<Acc, b.Index>> extends true ?

        GetInternal<Exclude<Acc, First | u.Has<Acc, Last> extends true ? never : b.Index>,
                fl.First<Any, Extract<Acc, b.Index>>> :

        GetInternal<Exclude<Acc, First>, Any>

type GetLast<Acc, Any> =
        c.Loosely<u.Has<Acc, b.Index>> extends true ?
        GetInternal<Exclude<Acc, Last | b.Index>, fl.Last<Any, Extract<Acc, b.Index>>> :
        GetInternal<Exclude<Acc, Last>, Any>


type GetAt<Acc, Any> =
        Acc extends Head ? a.Head<Any> :
        Acc extends Tail ? a.Tail<Any> :
        Acc extends b.IndexOf<Any> ? GetAtIndex<Any, Acc> :
        Acc extends TupleConstructor ? GetAtAccessors<Acc, Any> :
        undefined;

type GetAtAccessors<AccessorTuple, Tuple> =
        f.Call<{
            [f.isEmpty]: b.EmptyT
            [f.isMaybeInfinite]: Tuple
            [f.isFinitelyIterable]:
                    {
                        [f.isSingular]: [GetAtAccessor<Tuple, a.Head<AccessorTuple>>]
                        [f.hasSuffix]:
                                [
                                    GetAtAccessor<Tuple, a.Head<AccessorTuple>>,
                                    ...c.Cast<GetAtAccessors<a.Suffix<AccessorTuple>, Tuple>, b.T>
                                ]
                    }
        }, AccessorTuple>


type GetAtAccessor<Tuple, Accessor> =
        Accessor extends Head ? a.Head<Tuple> :
        Accessor extends Tail ? a.Tail<Tuple> :
        c.IsExactly<Accessor, number> extends true ? b.ValueOf<Tuple> :
        Accessor extends b.IndexOf<Tuple> ? GetAtIndex<Tuple, Accessor> :
        undefined


type GetAtIndex<Tuple, Index> = c.Cast<Tuple, b.T>[c.Cast<Index, number>];


import * as c from '../../core/coreTraits';

import * as u from '../core/unionTraits';


import * as b from './core/core/baseTupleTraits';
import * as f from './core/core/tupleFunction';

import * as a from './core/accessFunctions';
import * as fl from './core/firstLastFunctions';


import environment from '../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const getAtIndex: c.IsExactly<Get<0, [string, number]>, string> = true;
    // noinspection JSUnusedLocalSymbols
    const getAtIndexOutOfRange: c.IsExactly<Get<4, [string, number]>, undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const getAtIndexNegative: c.IsExactly<Get<-4, [string, number]>, undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const getAtIndexEmpty: c.IsExactly<Get<0, b.EmptyT>, undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const getAtIndexLengthless: c.IsExactly<Get<10, number[]>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const getAtIndexMixed: c.IsExactly<Get<Suffix | 0 | 10, [string, number]>, number | undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const getAtIndexTuple:
            c.IsExactly<Get<Suffix | [0, 2] | 1, [string, number, boolean, string]>,
                    [number, string] | boolean> = true;
    // TODO: fix
    // noinspection JSUnusedLocalSymbols
    const getAtIndexLast:
            c.IsExactly<Get<Last | 3, [string, number, boolean, string, bigint]>,
                    [boolean, string, bigint]> = true;
}
