// noinspection JSUnusedGlobalSymbols
export type FlattenOnce<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        FlattenOnceInternal<Any> :

        never :
        c.Requires<Any, b.T>


// noinspection JSUnusedGlobalSymbols
export type IsDeep<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        IsDeepInternal<Any> :

        never :
        c.Requires<Any, b.T>

// noinspection JSUnusedGlobalSymbols
export type IsShallow<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?

        c.Not<IsDeepInternal<Any>> :

        c.Requires<Any, b.T>;


type FlattenHeadAsTuple<Tuple> =
        o.IsHeadOptional<Tuple> extends true ?

        FlattenOnce<a.Suffix<Tuple>> |
        s.SpreadBoth<Exclude<a.Head<Tuple>, c.NotRequired>, FlattenOnce<a.Suffix<Tuple>>> :

        s.SpreadBoth<a.Head<Tuple>, FlattenOnce<a.Suffix<Tuple>>>;

type FlattenHeadAsNotTuple<Tuple> =
        s.SpreadBoth<o.IsHeadOptional<Tuple> extends true ?
                     [c.ToRequired<a.Head<Tuple>>?] :
                     [a.Head<Tuple>],
                FlattenOnce<a.Suffix<Tuple>>>;

type FlattenHead<Tuple> =
        c.Loosely<c.Is<a.Head<Tuple>, b.T>> extends true ? FlattenHeadAsTuple<Tuple> :
        FlattenHeadAsNotTuple<Tuple>

type FlattenOnceInternal<Any> =
        f.Call<{
            [f.isEmpty]: c.If<c.Strictly<c.Is<b.ValueOf<Any>, b.T>>, b.ValueOf<Any>, Any>,
            [f.isMaybeInfinite]: c.If<c.Strictly<c.Is<b.ValueOf<Any>, b.T>>, b.ValueOf<Any>, Any>
            [f.isFinitelyIterable]: FlattenHead<Any>
        }, Any>;


type IsDeepInternal<Any> =
        f.Call<{
            [f.isEmpty]: c.Is<b.ValueOf<Any>, b.T>,
            [f.isMaybeInfinite]: c.Is<b.ValueOf<Any>, b.T>,
            [f.isFinitelyIterable]:
                    {
                        [f.hasSuffix]: c.Loosely<c.Is<a.Head<Any>, b.T>> extends true ?
                                       c.Is<a.Head<Any>, b.T> :
                                       IsDeep<a.Suffix<Any>>
                        [f.isSingular]: c.Is<a.Head<Any>, b.T>
                    }
        }, Any>;


import * as c from '../../core/coreTraits';


import * as b from './core/core/baseTupleTraits';
import * as f from './core/core/tupleFunction';

import * as a from './core/accessFunctions';
import * as s from './core/spreadFunctions';
import * as o from './core/optionalTraits';


import environment from '../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const flattenOnceTest: c.IsExactly<FlattenOnce<[number, string?]>, [number, string?]> = true;
    // noinspection JSUnusedLocalSymbols
    const flattenOnceTestNever: c.IsExactly<FlattenOnce<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const flattenOnceTestNotTuple: c.IsExactly<FlattenOnce<string>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const flattenOnceTestMaybeTuple: c.IsExactly<FlattenOnce<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const flattenOnceTestEmpty: c.IsExactly<FlattenOnce<b.EmptyT>, b.EmptyT> = true;
    // noinspection JSUnusedLocalSymbols
    const flattenOnceTestEmptyDeep: c.IsExactly<FlattenOnce<b.EmptyTuple<number[]>>, number[]> = true;
    // noinspection JSUnusedLocalSymbols
    const flattenOnceTestLengthless: c.IsExactly<FlattenOnce<number[][]>, number[]> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const flattenOnceTestSingle: c.IsExactly<FlattenOnce<[number]>, [number]> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const flattenOnceTestPartial:
            c.IsExactly<FlattenOnce<[number?, string?, [bigint, string?]?]>,
                    [number?, string?] |
                    [bigint, string?] |
                    [string | undefined, bigint, string?] |
                    [number | undefined, bigint, string?] |
                    [number | undefined, string | undefined, bigint, string?]> = true;
    // noinspection JSUnusedLocalSymbols
    const flattenOnceTestPartialBefore:
            c.IsExactly<FlattenOnce<[[string?], number, [string, number?]?]>,
                    [number] |
                    [number, string, number?] |
                    [string | undefined, number] |
                    [string | undefined, number, string, number?]> = true;
    // NOTE: I could minimize the union count here, but it would be extremely difficult.
    // noinspection JSUnusedLocalSymbols
    const flattenOnceTestUnionPartial:
            c.IsExactly<FlattenOnce<[number, ([bigint, number?] | bigint)?, string?]>,
                    [number, string?] |
                    [number, bigint, string?] |
                    [number, bigint, number?, string?]> = true;
    // noinspection JSUnusedLocalSymbols
    const flattenOnceTestMixed:
            c.IsExactly<FlattenOnce<[[[1], 3, 4], [], [[3]], [5], 6]>, [[1], 3, 4, [3], 5, 6]> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const flattenOnceTestUnion: c.IsExactly<FlattenOnce<number[] | [[string]?]>, number[] | [] | [string]> = true;


    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const isDeepTest: c.IsExactly<IsDeep<[number, null[], string?]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isDeepTestNever: c.IsExactly<IsDeep<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const isDeepTestNotTuple: c.IsExactly<IsDeep<string>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const isDeepTestMaybeTuple: c.IsExactly<IsDeep<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const isDeepTestEmpty: c.IsExactly<IsDeep<b.EmptyT>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isDeepTestEmptyDeep: c.IsExactly<IsDeep<b.EmptyTuple<number[]>>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isDeepTestLengthless: c.IsExactly<IsDeep<number[][]>, true> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const isDeepTestSingle: c.IsExactly<IsDeep<[number]>, false> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const isDeepTestUnion: c.IsExactly<IsDeep<[number] | number[][]>, boolean> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const isDeepTestPartial: c.IsExactly<IsDeep<[number?, null[]?, string?]>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const isDeepTestMixed: c.IsExactly<IsDeep<[1, 3 | number[], 2?, [[[3?]?]?]?]>, boolean> = true;
}
