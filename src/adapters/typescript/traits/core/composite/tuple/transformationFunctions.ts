// noinspection JSUnusedGlobalSymbols
export type ToOptional<Any, Indices = b.IndexOf<Any>> = To<'optional', Any, Indices>
// noinspection JSUnusedGlobalSymbols
export type ToRequired<Any, Indices = b.IndexOf<Any>> = To<'required', Any, Indices>

// noinspection JSUnusedGlobalSymbols
export type Modifier = 'optional' | 'required';

// noinspection JSUnusedGlobalSymbols, JSClassNamingConvention
export type To<Mod, Any, Indices = b.IndexOf<Any>> =
        c.True<c.Requires<Mod, Modifier, 'union'>> extends true ?
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        c.IsExactly<Mod, Modifier> extends true ? Any :
        Mod extends 'optional' ? ToOptionalInternal<Any, Indices> :
        Mod extends 'required' ? ToRequiredInternal<Any, Indices> :
        Any :

        never :
        c.Requires<Any, b.T> :
        c.Requires<Mod, Modifier, 'union'>;


// noinspection JSUnusedGlobalSymbols
export type ToUnion<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        ToUnionInternal<Any> :

        never :
        c.Requires<Any, b.T>

// noinspection JSUnusedGlobalSymbols
export type ToIntersection<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        ToIntersectionInternal<Any> :

        never :
        c.Requires<Any, b.T>

// noinspection JSUnusedGlobalSymbols
export type ToObject<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        ToObjectInternal<Any> :

        never :
        c.Requires<Any, b.T>

// noinspection JSUnusedGlobalSymbols
export type ToFunction<Tuple> =
        c.True<c.Requires<Tuple, b.T>> extends true ?
        Tuple extends any ?

        ToFunctionInternal<Tuple> :

        never :
        c.Requires<Tuple, b.T>


type ToUnionInternal<Tuple> =
        f.Call<{
            [f.isEmpty]: b.ValueOf<Tuple>
            [f.isMaybeInfinite]: b.ValueOf<Tuple>
            [f.isFinitelyIterable]:
                    {
                        [f.hasSuffix]: a.Head<Tuple> | ToUnionInternal<a.Suffix<Tuple>>
                        [f.isSingular]: a.Head<Tuple>
                    }
        }, Tuple>

type ToIntersectionInternal<Tuple> =
        f.Call<{
            [f.isEmpty]: never
            [f.isMaybeInfinite]: b.ValueOf<Tuple>
            [f.isFinitelyIterable]:
                    {
                        [f.hasSuffix]: a.Head<Tuple> & ToIntersectionInternal<a.Suffix<Tuple>>
                        [f.isSingular]: a.Head<Tuple>
                    }
        }, Tuple>

type ToObjectInternal<Tuple, Indices = b.IndexOf<Tuple>> =
        {
            [Key in c.Cast<Indices, keyof Tuple>]: Tuple[Key]
        }

type ToFunctionInternal<Tuple> =
        f.Call<{
            [f.isEmpty]: () => void
            [f.isMaybeInfinite]: (...args: b.ValueOf<Tuple>[]) => b.ValueOf<Tuple>
            [f.isFinitelyIterable]:
                    {
                        [f.hasSuffix]: (...args: c.Cast<a.Prefix<Tuple>, b.T>) => a.Tail<Tuple>
                        [f.isSingular]: () => a.Tail<Tuple>
                    }
        }, Tuple>


type TailToOptional<Tuple, Indices> =
        b.MaxSize<a.Prefix<Tuple>> extends Indices ? [c.ToRequired<a.Tail<Tuple>>?] :
        o.IsTailOptional<Tuple> extends true ? [c.ToRequired<a.Tail<Tuple>>?] :
        [a.Tail<Tuple>]

type ToOptionalInternal<Tuple, Indices> =
        f.Call<{
            [f.isEmpty]: b.EmptyT
            [f.isMaybeInfinite]: b.Tuple<b.ValueOf<Tuple> | undefined>
            [f.isFinitelyIterable]:
                    {
                        [f.hasSuffix]:
                                s.SpreadBoth<ToOptionalInternal<a.Prefix<Tuple>, Indices>,
                                        TailToOptional<Tuple, Indices>>

                        [f.isSingular]: TailToOptional<Tuple, Indices>
                    }
        }, Tuple>;

type TailToRequired<Tuple, Indices> =
        b.MaxSize<a.Prefix<Tuple>> extends Indices ? [c.ToRequired<a.Tail<Tuple>>] :
        o.IsTailOptional<Tuple> extends true ? [c.ToRequired<a.Tail<Tuple>>?] :
        [a.Tail<Tuple>]

type ToRequiredInternal<Tuple, Indices> =
        f.Call<{
            [f.isEmpty]: b.EmptyT
            [f.isMaybeInfinite]: b.Tuple<Exclude<b.ValueOf<Tuple>, undefined>>
            [f.isFinitelyIterable]:
                    {
                        [f.hasSuffix]:
                                s.SpreadBoth<ToRequiredInternal<a.Prefix<Tuple>, Indices>,
                                        TailToRequired<Tuple, Indices>>

                        [f.isSingular]: TailToRequired<Tuple, Indices>
                    }
        }, Tuple>


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
    // noinspection JSUnusedLocalSymbols
    const toUnionTestNever: c.IsExactly<ToUnion<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const toUnionTestNotTuple: c.IsExactly<ToUnion<string>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const toUnionTestMaybeTuple: c.IsExactly<ToUnion<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const toUnionTestEmpty: c.IsExactly<ToUnion<b.EmptyT>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const toUnionTestLengthless: c.IsExactly<ToUnion<number[]>, number> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toUnionTest: c.IsExactly<ToUnion<[number, null[], string?]>, number | string | null[] | undefined> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toUnionTestUnion: c.IsExactly<ToUnion<[number] | [string]>, number | string> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toUnionTestSingle: c.IsExactly<ToUnion<[number]>, number> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toUnionTestPartial:
            c.IsExactly<ToUnion<[number?, null[]?, string?]>,
                    number | string | null[] | undefined> = true;

    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestNever: c.IsExactly<ToIntersection<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestNotTuple: c.IsExactly<ToIntersection<string>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestMaybeTuple: c.IsExactly<ToIntersection<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestEmpty: c.IsExactly<ToIntersection<b.EmptyT>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestLengthless: c.IsExactly<ToIntersection<number[]>, number> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toIntersectionTest: c.IsExactly<ToIntersection<[number, null[], string?]>, never> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toIntersectionTestSingle: c.IsExactly<ToIntersection<[number]>, number> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toIntersectionTestUnion: c.IsExactly<ToIntersection<[number] | [string]>, number | string> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toIntersectionTestLong:
            c.IsExactly<ToIntersection<[{ a: string }, { b: number }]>,
                    { a: string } & { b: number }> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toIntersectionTestPartial:
            c.IsExactly<ToIntersection<[{ a: string }, { b: number }?]>,
                    { a: string } & { b: number }> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toIntersectionTestDoublePartial:
            c.IsExactly<ToIntersection<[{ a: string }?, { b: number }?]>,
                    { a: string } & { b: number } | undefined> = true;


    // noinspection JSUnusedLocalSymbols
    const toOptionalTestNever: c.IsExactly<ToOptional<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const toOptionalTestNotTuple: c.IsExactly<ToOptional<string>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const toOptionalTestMaybeTuple: c.IsExactly<ToOptional<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const toOptionalTestEmpty: c.IsExactly<ToOptional<b.EmptyT>, b.EmptyT> = true;
    // noinspection JSUnusedLocalSymbols
    const toOptionalTestLengthless: c.IsExactly<ToOptional<number[]>, (number | undefined)[]> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toOptionalTestSingle: c.IsExactly<ToOptional<[number]>, [number?]> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toOptionalTestPartial: c.IsExactly<ToOptional<[number?, null[]?]>, [number?, null[]?]> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toOptionalTestUnion: c.IsExactly<ToOptional<[number] | [string]>, [number?] | [string?]> = true;

    // noinspection JSUnusedLocalSymbols
    const toRequiredTestNever: c.IsExactly<ToRequired<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const toRequiredTestNotTuple: c.IsExactly<ToRequired<string>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const toRequiredTestMaybeTuple: c.IsExactly<ToRequired<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const toRequiredTestEmpty: c.IsExactly<ToRequired<b.EmptyT>, b.EmptyT> = true;
    // noinspection JSUnusedLocalSymbols
    const toRequiredTestLengthless: c.IsExactly<ToRequired<(number | undefined)[]>, (number)[]> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toRequiredTest: c.IsExactly<ToRequired<[number, null[], string?]>, [number, null[], string]> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toRequiredTestSingle: c.IsExactly<ToRequired<[number?]>, [number]> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toRequiredTesPartial: c.IsExactly<ToRequired<[number?, null[]?, string?]>, [number, null[], string]> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toRequiredTestUnion: c.IsExactly<ToRequired<[number?] | [string?]>, [number] | [string]> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toRequiredTestIndices:
            c.IsExactly<ToRequired<[number?, null[]?, string?], 0 | 1>, [number, null[], string?]> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const toRequiredTestIndicesSplit:
            c.IsExactly<ToRequired<[number?, null[]?, string?], 1>,
                    [null[], string?] |
                    [number | undefined, null[], string?]> = true;
}
