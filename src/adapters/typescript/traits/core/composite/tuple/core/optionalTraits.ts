// noinspection JSUnusedGlobalSymbols
export type HeadTuple<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        HeadTupleInternal<Any> :

        never :
        c.Requires<Any, b.T>

// noinspection JSUnusedGlobalSymbols
export type TailTuple<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        TailTupleInternal<Any> :

        never :
        c.Requires<Any, b.T>

// noinspection JSUnusedGlobalSymbols
export type IsHeadOptional<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        IsHeadOptionalInternal<Any> :

        never :
        c.Requires<Any, b.T>

// noinspection JSUnusedGlobalSymbols
export type IsTailOptional<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        IsTailOptionalInternal<Any> :

        never :
        c.Requires<Any, b.T>


type HeadTupleInternal<Tuple> =
        f.Call<{
            [f.isEmpty]: never,
            [f.isMaybeInfinite]: never,
            [f.isFinitelyIterable]: HeadTupleIsFinitelyIterable<Tuple>
        }, Tuple>

type TailTupleInternal<Tuple> =
        f.Call<{
            [f.isEmpty]: never,
            [f.isMaybeInfinite]: never,
            [f.isFinitelyIterable]: TailTupleIsFinitelyIterable<Tuple>
        }, Tuple>


type IsHeadOptionalInternal<Tuple> =
        f.Call<{
            [f.isEmpty]: never,
            [f.isMaybeInfinite]: never,
            [f.isFinitelyIterable]: IsHeadOptionalIsFinitelyIterable<Tuple>
        }, Tuple>

type IsTailOptionalInternal<Tuple> =
        f.Call<{
            [f.isEmpty]: never,
            [f.isMaybeInfinite]: never,
            [f.isFinitelyIterable]: IsTailOptionalIsFinitelyIterable<Tuple>
        }, Tuple>


type HeadTupleIsFinitelyIterable<Tuple> =
        IsHeadOptionalInternal<Tuple> extends true ? [c.ToRequired<a.Head<Tuple>>?] :
        [a.Head<Tuple>]

type TailTupleIsFinitelyIterable<Tuple> =
        IsTailOptionalInternal<Tuple> extends true ? [c.ToRequired<a.Tail<Tuple>>?] :
        [a.Tail<Tuple>]


// noinspection JSClassNamingConvention
type ReconstructWithOptionalHeadAsPossiblyUndefinedHead<Tuple> =
        [a.Head<Tuple>, ...c.Cast<a.Suffix<Tuple>, b.T>];
type IsHeadPossiblyJustUndefined<Tuple> =
        c.Strictly<c.Is<Tuple, ReconstructWithOptionalHeadAsPossiblyUndefinedHead<Tuple>>>
type IsHeadOptionalIsFinitelyIterable<Tuple> =
        c.Not<c.Or<c.Strictly<c.IsRequired<a.Head<Tuple>>>, IsHeadPossiblyJustUndefined<Tuple>>>

// noinspection JSClassNamingConvention
type ReconstructWithOptionalTailAsPossiblyUndefinedTail<Any> =
        [...c.Cast<a.Prefix<Any>, b.T>, a.Tail<Any>];
type IsTailPossiblyJustUndefined<Any> =
        c.Strictly<c.Is<Any, ReconstructWithOptionalTailAsPossiblyUndefinedTail<Any>>>
type IsTailOptionalIsFinitelyIterable<Tuple> =
        c.Not<c.Or<c.Strictly<c.IsRequired<a.Tail<Tuple>>>, IsTailPossiblyJustUndefined<Tuple>>>


import * as c from '../../../core/coreTraits';


import * as b from './core/baseTupleTraits';
import * as f from './core/tupleFunction';

import * as a from './accessFunctions';


import environment from '../../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const headTupleTestUndefined: c.IsExactly<HeadTuple<[string | undefined, string]>, [string | undefined]> = true;
    // noinspection JSUnusedLocalSymbols
    const headTupleTestOptional: c.IsExactly<HeadTuple<[any?]>, [any?]> = true;
    // noinspection JSUnusedLocalSymbols
    const headTupleTestAny: c.IsExactly<HeadTuple<[any]>, [any]> = true;
    // noinspection JSUnusedLocalSymbols
    const headTupleTestEmpty: c.IsExactly<HeadTuple<[]>, never> = true;

    // noinspection JSUnusedLocalSymbols
    const tailTupleTestUndefined: c.IsExactly<TailTuple<[any, string | undefined]>, [string | undefined]> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTupleTestOptional: c.IsExactly<TailTuple<[any, any?]>, [any?]> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTupleTestAny: c.IsExactly<TailTuple<[any]>, [any]> = true;


    // noinspection JSUnusedLocalSymbols
    const isHeadOptionalTestUndefined: c.IsExactly<IsHeadOptional<[string | undefined, string]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isHeadOptionalTestOptional: c.IsExactly<IsHeadOptional<[any?]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isHeadOptionalTestAny: c.IsExactly<IsHeadOptional<[any]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isHeadOptionalTestEmpty: c.IsExactly<IsHeadOptional<[]>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const isHeadOptionalTestSizeless: c.IsExactly<IsHeadOptional<number[]>, never> = true;

    // noinspection JSUnusedLocalSymbols
    const isTailOptionalTestUndefined: c.IsExactly<IsTailOptional<[any, string | undefined]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isTailOptionalTestOptional: c.IsExactly<IsTailOptional<[any, any?]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isTailOptionalTestAny: c.IsExactly<IsTailOptional<[any]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isTailOptionalTestEmpty: c.IsExactly<IsTailOptional<[]>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const isTailOptionalTestSizeless: c.IsExactly<IsTailOptional<number[]>, never> = true;
}
