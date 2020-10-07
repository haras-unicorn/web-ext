// noinspection JSUnusedGlobalSymbols
export type Modifier = Both
// noinspection JSUnusedGlobalSymbols
export type Both = Head | Tail
// noinspection JSUnusedGlobalSymbols
export type Head = 'head'
// noinspection JSUnusedGlobalSymbols
export type Tail = 'tail'
// noinspection JSUnusedGlobalSymbols
export type None = never
// noinspection JSUnusedGlobalSymbols
export type Spread<Mod, Head, Tail> =
        c.True<c.Requires<Mod, Modifier, 'union'>> extends true ?

        SpreadInternal<Mod, Head, Tail> :

        c.Requires<Mod, Modifier, 'union'>

// noinspection JSUnusedGlobalSymbols
export type SpreadBoth<Head, Tail> =
        Head extends any ?
        Tail extends any ?
        SpreadBothInternal<Head, Tail> :
        never :
        never;
// noinspection JSUnusedGlobalSymbols
export type Extend<Head, Tail> = SpreadBoth<Head, Tail>
// noinspection JSUnusedGlobalSymbols
export type Concat<Head, Tail> = SpreadBoth<Head, Tail>

// noinspection JSUnusedGlobalSymbols
export type SpreadHead<Head, Tail> =
        Head extends any ?
        SpreadHeadInternal<Head, Tail> :
        never;
// noinspection JSUnusedGlobalSymbols
export type Append<Head, Tail> = SpreadHead<Head, Tail>

// noinspection JSUnusedGlobalSymbols
export type SpreadTail<Head, Tail> =
        Tail extends any ?
        SpreadTailInternal<Head, Tail> :
        never;
// noinspection JSUnusedGlobalSymbols
export type Prepend<Head, Tail> = SpreadTail<Head, Tail>


// noinspection JSUnusedGlobalSymbols
export type PartialAsUnion<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        PartialAsUnionInternal<Any> :

        never :
        c.Requires<Any, b.T>


type SpreadInternal<Mod, THead, TTail> =
        c.IsNever<Mod> extends true ? p.Pair<THead, TTail> :
        [Mod] extends [Head] ? SpreadHead<THead, TTail> :
        [Mod] extends [Tail] ? SpreadTail<THead, TTail> :
        [Mod] extends [Both] ? SpreadBoth<THead, TTail> :
        never;

type SpreadBothInternal<Head, Tail> =
        c.Is<Head, b.T> extends true ?
        c.Is<Tail, b.T> extends true ?

        b.IsEmpty<Head> extends true ? b.IsEmpty<Tail> extends true ?
                                       b.EmptyTuple<b.ValueOf<Head> | b.ValueOf<Tail>> :
                                       Tail :
        b.IsEmpty<Tail> extends true ? Head :

        [...c.Cast<PrepareHeadForSpreading<Head, Tail>, b.T>, ...c.Cast<Tail, b.T>] :

        SpreadHeadInternal<Head, Tail> :
        SpreadTailInternal<Head, Tail>;

type SpreadHeadInternal<Head, Tail> =
        c.Is<Head, b.T> extends true ? c.Not<c.IsRequired<Tail>> extends true ?

                                       b.IsEmpty<Head> extends true ? [Tail?] :
                                       [...c.Cast<PrepareHeadForSpreading<Head, Tail>, b.T>, Tail?] :

                                       b.IsEmpty<Head> extends true ? [Tail] :
                                       [...c.Cast<PrepareHeadForSpreading<Head, Tail>, b.T>, Tail] :
        p.Pair<Head, Tail>;

type SpreadTailInternal<Head, Tail> =
        c.Is<Tail, b.T> extends true ? c.Not<c.IsRequired<Head>> extends true ?

                                       b.IsEmpty<Tail> extends true ? [Head?] :
                                       Tail | [Head, ...c.Cast<Tail, b.T>] :

                                       b.IsEmpty<Tail> extends true ? [Head] :
                                       [Head, ...c.Cast<Tail, b.T>] :
        p.Pair<Head, Tail>


type PartialAsUnionInternal<Tuple> =
        f.Call<{
            [f.isEmpty]: Tuple,
            [f.isMaybeInfinite]: Tuple,
            [f.isFinitelyIterable]:
                    {
                        [f.condition]: b.IsFinitelyIterable<Tuple>,
                        [f.recurse]: PartialHeadToUnion<Tuple>,
                        [f.done]: [a.Head<Tuple>]
                    }
        }, Tuple>;


type HasOptional<Any> = u.IsUnion<b.Size<Any>>;

type AreAllOptional<Any> = c.And<HasOptional<Any>, c.IsGreaterOrEqual<0, b.Size<Any>>>

type PrepareHeadForSpreading<Head, Tail> =
        HasOptional<Head> extends true ? AreAllOptional<Tail> extends true ? Head :
                                         PartialAsUnionInternal<Head> :
        Head;


type ConcatImpartialHead<Head, Suffix> =
        b.IsEmpty<Suffix> extends true ? [Head] :
        [Head, ...c.Cast<Suffix, b.T>];

type ConcatPartialHead<Head, Suffix> =
        b.IsEmpty<Suffix> extends true ? [Head | undefined] :
        [Head | undefined, ...c.Cast<Suffix, b.T>];

type PartialHeadToUnion<Any> =
        o.IsHeadOptional<Any> extends true ?
        PartialAsUnion<a.Suffix<Any>> | ConcatPartialHead<a.Head<Any>, PartialAsUnion<a.Suffix<Any>>> :
        ConcatImpartialHead<a.Head<Any>, PartialAsUnion<a.Suffix<Any>>>;


import * as c from '../../../core/coreTraits';

import * as u from '../../core/unionTraits';


import * as b from './core/baseTupleTraits';
import * as p from './core/pairTraits';
import * as f from './core/tupleFunction';

import * as a from './accessFunctions';
import * as o from './optionalTraits';


import environment from '../../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const spreadTestBoth: c.IsExactly<Spread<Both, [string], [number]>, [string, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadTestTail: c.IsExactly<Spread<Tail, [string], [number]>, [[string], number]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadTestHead: c.IsExactly<Spread<Head, [string], [number]>, [string, [number]]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadTestNone: c.IsExactly<Spread<None, [string], [number]>, [[string], [number]]> = true;


    // noinspection JSUnusedLocalSymbols
    const spreadBothTest: c.IsExactly<SpreadBoth<[string], [number]>, [string, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadBothTestPartialHead:
            c.IsExactly<SpreadBoth<[string?], number>, [number] | [string | undefined, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadBothTestPartialTail:
            c.IsExactly<SpreadBoth<string, [number?]>, [string, number?]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadBothTestPartial:
            c.IsExactly<SpreadBoth<[string?], [number?]>, [string?, number?]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadBothTestUndefined:
            c.IsExactly<SpreadBoth<[string | undefined], [number?]>, [string | undefined, number?]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadBothTestEmptyHead:
            c.IsExactly<SpreadBoth<b.EmptyTuple<number>, number>, [number]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadBothTestEmptyTail:
            c.IsExactly<SpreadBoth<[string, number], b.EmptyTuple<number>>, [string, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadBothTestAny:
            c.IsExactly<SpreadBoth<PartialAsUnion<[string?]>, any>, [any] | [string | undefined, any]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadBothTestPrimitive:
            c.IsExactly<SpreadBoth<string, number>, [string, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadBothTestUnion:
            c.IsExactly<SpreadBoth<[string] | undefined, number>,
                    [number] | [undefined, number] | [string, number]> = true;

    // noinspection JSUnusedLocalSymbols
    const spreadHeadTest: c.IsExactly<SpreadHead<string, number>, [string, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadHeadTestPartialHead:
            c.IsExactly<SpreadHead<PartialAsUnion<[string?]>, number>, [number] | [string | undefined, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadHeadTestPartialTail:
            c.IsExactly<SpreadHead<string, number | undefined>, [string, number?]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadHeadTestPartial:
            c.IsExactly<SpreadHead<PartialAsUnion<[string?]>, number | undefined>,
                    [number?] | [string | undefined, number?]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadHeadTestAny:
            c.IsExactly<SpreadHead<string | undefined, any>, [any] | [string, any] | [undefined, any]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadHeadTestPrimitive:
            c.IsExactly<SpreadHead<string, number>, [string, number]> = true;

    // noinspection JSUnusedLocalSymbols
    const spreadTailTest: c.IsExactly<SpreadTail<string, number>, [string, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadTailTestPartialHead:
            c.IsExactly<SpreadTail<string | undefined, [number]>, [number] | [string | undefined, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadTailTestPartialTail:
            c.IsExactly<SpreadTail<string, [number?]>, [string, number?]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadTailTestPartial:
            c.IsExactly<SpreadTail<string | undefined, [number?]>, [number?] | [string | undefined, number?]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadTailTestAny:
            c.IsExactly<SpreadTail<string | undefined, any>, [any] | [string | undefined, any]> = true;
    // noinspection JSUnusedLocalSymbols
    const spreadTailTestPrimitive:
            c.IsExactly<SpreadTail<string, number>, [string, number]> = true;

    // noinspection JSUnusedLocalSymbols
    const noSpreadTest: c.IsExactly<p.Pair<string, number>, [string, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const noSpreadTestPartialHead:
            c.IsExactly<p.Pair<string | undefined, number>, [number] | [string | undefined, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const noSpreadTestPartialTail:
            c.IsExactly<p.Pair<string, number | undefined>, [string, number?]> = true;
    // noinspection JSUnusedLocalSymbols
    const noSpreadTestPartial:
            c.IsExactly<p.Pair<string | undefined, number | undefined>, [string?, number?]> = true;
    // noinspection JSUnusedLocalSymbols
    const noSpreadTestAny:
            c.IsExactly<p.Pair<string | undefined, any>, [any] | [string | undefined, any]> = true;


    // noinspection JSUnusedLocalSymbols
    const partialAsUnionTest:
            c.IsExactly<PartialAsUnion<[string?, number?]>,
                    [] |
                    [string | undefined] |
                    [number | undefined] |
                    [string | undefined, number | undefined]> = true;
    // noinspection JSUnusedLocalSymbols
    const partialAsUnionTestSingle: c.IsExactly<PartialAsUnion<[string?]>, [] | [string | undefined]> = true;
    // noinspection JSUnusedLocalSymbols
    const partialAsUnionTestMixed:
            c.IsExactly<PartialAsUnion<[number, string?]>, [number] | [number, string | undefined]> = true;
    // noinspection JSUnusedLocalSymbols
    const partialAsUnionTestEmpty: c.IsExactly<PartialAsUnion<[]>, []> = true;
    // noinspection JSUnusedLocalSymbols
    const partialAsUnionTestAny: c.IsExactly<PartialAsUnion<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const partialAsUnionTestNever: c.IsExactly<PartialAsUnion<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const partialAsUnionTestMaybe: c.IsExactly<PartialAsUnion<number[] | 2>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const partialAsUnionTestUndefined: c.IsExactly<PartialAsUnion<[number | undefined]>, [number | undefined]> = true;
    // noinspection JSUnusedLocalSymbols
    const partialAsUnionTestUnion:
            c.IsExactly<PartialAsUnion<[number, string?] | [symbol?]>,
                    [number] | [number, string | undefined] | [] | [symbol | undefined]> = true;
}
