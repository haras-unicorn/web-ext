// noinspection JSUnusedGlobalSymbols
export type Head<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        HeadInternal<Any> :

        never :
        c.Requires<Any, b.T>

// noinspection JSUnusedGlobalSymbols
export type Tail<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        TailInternal<Any> :

        never :
        c.Requires<Any, b.T>

// noinspection JSUnusedGlobalSymbols
export type Prefix<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        PrefixInternal<Any> :

        never :
        c.Requires<Any, b.T>

// noinspection JSUnusedGlobalSymbols
export type Suffix<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        SuffixInternal<Any> :

        never :
        c.Requires<Any, b.T>


// TODO: better lengthless support

type HeadInternal<Tuple> =
        f.Call<{
            [f.isEmpty]: never,
            [f.isMaybeInfinite]: HeadIsMaybeInfinite<Tuple>,
            [f.isFinitelyIterable]: HeadIsFinitelyIterable<Tuple>
        }, Tuple>

type TailInternal<Tuple> =
        f.Call<{
            [f.isEmpty]: never
            [f.isMaybeInfinite]: b.ValueOf<Tuple> | undefined
            [f.isFinitelyIterable]:
                    {
                        [f.isSingular]: TailIsSingular<Tuple>
                        [f.hasSuffix]: TailHasSuffix<Tuple>
                    }
        }, Tuple>


type PrefixInternal<Tuple> =
        f.Call<{
            [f.isEmpty]: never
            [f.isMaybeInfinite]: b.ValueOf<Tuple>[]
            [f.isFinitelyIterable]:
                    {
                        [f.isSingular]: b.EmptyT
                        [f.hasSuffix]: PrefixHasSuffix<Tuple>
                    }
        }, Tuple>

type SuffixInternal<Tuple> =
        f.Call<{
            [f.isEmpty]: never
            [f.isMaybeInfinite]: SuffixIsMaybeInfinite<Tuple>
            [f.isFinitelyIterable]:
                    {
                        [f.isSingular]: b.EmptyT
                        [f.hasSuffix]: SuffixHasSuffix<Tuple>
                    }
        }, Tuple>


type SuffixIsMaybeInfinite<Tuple> = c.Try<SuffixHasSuffix<Tuple>, b.ValueOf<Tuple>[]>

type HeadIsMaybeInfinite<Tuple> = c.Try<HeadIsFinitelyIterable<Tuple>, b.ValueOf<Tuple> | undefined>

type TailIsSingular<Tuple> =
        c.Try<Tuple extends [infer Tail] ? Tail : never,
                Tuple extends [(infer Tail)?] ? Tail | undefined : never>

type TailHasSuffix<Tuple> =
        c.Try<Tuple extends [...c.Cast<PrefixHasSuffix<Tuple>, b.T>, infer Tail] ? Tail : never,
                Tuple extends [...c.Cast<PrefixHasSuffix<Tuple>, b.T>, (infer Tail)?] ? Tail | undefined : never>


type PrefixHasSuffix<Tuple> =
        c.Try<Tuple extends [...infer Prefix, any] ? Prefix : never,
                Tuple extends [...infer Prefix, any?] ? Prefix : never>

type SuffixHasSuffix<Tuple> =
        c.Try<Tuple extends [HeadIsFinitelyIterable<Tuple>, ...infer Suffix] ? Suffix : never,
                Tuple extends [HeadIsFinitelyIterable<Tuple>?, ...infer Suffix] ? Suffix : never>

type HeadIsFinitelyIterable<Tuple> =
        c.Try<Tuple extends [infer Head, ...b.T] ? Head : never,
                Tuple extends [(infer Head)?, ...b.T] ? Head | undefined : never>


import * as c from '../../../core/coreTraits';

import * as b from './core/baseTupleTraits';
import * as f from './core/tupleFunction';


import environment from '../../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const headTest: c.IsExactly<Head<[number]>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const headTestPartial: c.IsExactly<Head<[number?]>, number | undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const headTestMixed: c.IsExactly<Head<[number?, string?]>, number | undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const headTestVoid: c.IsExactly<Head<[void, string?]>, void> = true;
    // noinspection JSUnusedLocalSymbols
    const headTestLengthless: c.IsExactly<Head<number[]>, number | undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const headTestRest: c.IsExactly<Head<[...number[]]>, number | undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const headTestPrimitive: c.IsExactly<Head<number>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const headTestNever: c.IsExactly<Head<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const headTestEmpty: c.IsExactly<Head<b.EmptyT>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const headTestNeverTuple: c.IsExactly<Head<[never, ...never[]]>, never | undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const headTestUnion: c.IsExactly<Head<b.EmptyTuple<boolean> | [number] | [string, boolean]>, number | string> = true;

    // noinspection JSUnusedLocalSymbols
    const suffixTest: c.IsExactly<Suffix<[number, string]>, [string]> = true;
    // noinspection JSUnusedLocalSymbols
    const suffixTestAny: c.IsExactly<Suffix<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const suffixTestPartial: c.IsExactly<Suffix<[number?, string?, boolean?]>, [string?, boolean?]> = true;
    // noinspection JSUnusedLocalSymbols
    const suffixTestOne: c.IsExactly<Suffix<[number]>, []> = true;
    // noinspection JSUnusedLocalSymbols
    const suffixTestEmpty: c.IsExactly<Suffix<b.EmptyT>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const suffixTestNever: c.IsExactly<Suffix<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const suffixTestPrimitive: c.IsExactly<Suffix<number>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const suffixTestRest: c.IsExactly<Suffix<[any, ...number[]]>, number[]> = true;
    // noinspection JSUnusedLocalSymbols
    const suffixTestRestNever: c.IsExactly<Suffix<[any, ...never[]]>, never[]> = true;
    // noinspection JSUnusedLocalSymbols
    const suffixTestRestNonempty: c.IsExactly<Suffix<[any, ...[number, string?]]>, [number, string?]> = true;
    // noinspection JSUnusedLocalSymbols
    const suffixTestUnion:
            c.IsExactly<Suffix<b.EmptyTuple<boolean> | [number] | [string, boolean]>, [] | [boolean]> = true;


    // noinspection JSUnusedLocalSymbols
    const prefixTest: c.IsExactly<Prefix<[number, string]>, [number]> = true;
    // noinspection JSUnusedLocalSymbols
    const prefixTestAny: c.IsExactly<Prefix<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const prefixTestPartial: c.IsExactly<Prefix<[number?, string?, boolean?]>, [number?, string?]> = true;
    // noinspection JSUnusedLocalSymbols
    const prefixTestOne: c.IsExactly<Prefix<[number]>, b.EmptyT> = true;
    // noinspection JSUnusedLocalSymbols
    const prefixTestEmpty: c.IsExactly<Prefix<b.EmptyT>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const prefixTestNever: c.IsExactly<Prefix<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const prefixTestPrimitive: c.IsExactly<Prefix<number>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const prefixTestRest: c.IsExactly<Prefix<[...b.Tuple<number>, string]>, (number | string)[]> = true;
    // noinspection JSUnusedLocalSymbols
    const prefixTestRestNever: c.IsExactly<Prefix<[any, ...never[]]>, any[]> = true;
    // noinspection JSUnusedLocalSymbols
    const prefixTestRestNonempty: c.IsExactly<Prefix<[any, ...[number, string?]]>, [any, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const prefixTestUnion:
            c.IsExactly<Prefix<b.EmptyTuple<boolean> | [number] | [string, boolean]>, b.EmptyT | [string]> = true;

    // noinspection JSUnusedLocalSymbols
    const tailTest: c.IsExactly<Tail<[number]>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestPartial: c.IsExactly<Tail<[number?]>, number | undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestMixed: c.IsExactly<Tail<[string, string?, number?]>, number | undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestString: c.IsExactly<Tail<[void, string]>, string> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestLengthless: c.IsExactly<Tail<number[]>, number | undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestRest: c.IsExactly<Tail<[...number[]]>, number | undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestPrimitive: c.IsExactly<Tail<number>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestNever: c.IsExactly<Tail<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestEmpty: c.IsExactly<Tail<b.EmptyT>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestNeverTuple: c.IsExactly<Tail<[never, ...never[]]>, never | undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestUnion:
            c.IsExactly<Tail<b.EmptyTuple<boolean> | [number] | [string, symbol]>, number | symbol> = true;
}
