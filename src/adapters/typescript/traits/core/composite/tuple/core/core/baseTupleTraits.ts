// noinspection JSUnusedGlobalSymbols
export type Tuple<Element> = Element[];
// noinspection JSClassNamingConvention, JSUnusedLocalSymbols
export type T = Tuple<any>;

// noinspection JSUnusedGlobalSymbols
export function isTuple(any: any): any is T
{
    return (any as T)['length'] !== undefined &&
           (any as T)[Symbol.iterator] !== undefined;
}


// noinspection JSUnusedGlobalSymbols
export type Index = number;

// noinspection JSUnusedGlobalSymbols
export type IndexOf<Any> =
        c.True<c.Requires<Any, T>> extends true ?
        Any extends any ?

        c.Cast<IndexOfInternal<Any>, keyof Any> :

        never :
        c.Requires<Any, T>;

// noinspection JSUnusedGlobalSymbols
export type ValueOf<Any> =
        c.True<c.Requires<Any, T>> extends true ?
        Any extends any ?

        ValueOfInternal<Any> :

        never :
        c.Requires<Any, T>;

// noinspection JSUnusedGlobalSymbols
export type Has<Any, Index> =
        c.True<c.Requires<Any, T>> extends true ?
        Any extends any ?

        u.Has<IndexOfInternal<Any>, Index> :

        never :
        c.Requires<Any, T>;


// noinspection JSUnusedGlobalSymbols
export type EmptyTuple<Element> = Tuple<Element> & { length: 0 }
// noinspection JSUnusedGlobalSymbols
export type EmptyT = [];
// noinspection JSUnusedGlobalSymbols
export type NonEmptyTuple<Element> = [Element, ...Tuple<Element>];
// noinspection JSUnusedGlobalSymbols
export type NonEmptyT = NonEmptyTuple<any>;

// noinspection JSUnusedGlobalSymbols
export type Size<Any> =
        c.True<c.Requires<Any, T>> extends true ?
        Any extends any ?

        SizeInternal<Any> :

        never :
        c.Requires<Any, T>;

// noinspection JSUnusedGlobalSymbols
export type MaxSize<Any> =
        c.True<c.Requires<Any, T>> extends true ?
        Any extends any ?

        MaxSizeInternal<Any> :

        never :
        c.Requires<Any, T>;

// noinspection JSUnusedGlobalSymbols
export type IsMaybeInfinite<Any> =
        c.True<c.Requires<Any, T>> extends true ?
        Any extends any ?

        IsMaybeInifiniteInternal<Any> :

        never :
        c.Requires<Any, T>;

// noinspection JSUnusedGlobalSymbols
export type HasFiniteSize<Any> =
        c.True<c.Requires<Any, T>> extends true ?
        Any extends any ?

        HasFiniteLengthInternal<Any> :

        never :
        c.Requires<Any, T>;

// noinspection JSUnusedGlobalSymbols
export type IsEmpty<Any> =
        c.True<c.Requires<Any, T>> extends true ?
        Any extends any ?

        IsEmptyInternal<Any> :

        never :
        c.Requires<Any, T>;

// noinspection JSUnusedGlobalSymbols
export type IsFinitelyIterable<Any> =
        c.True<c.Requires<Any, T>> extends true ?
        Any extends any ?

        IsFinitelyIterableInternal<Any> :

        never :
        c.Requires<Any, T>;

// noinspection JSUnusedGlobalSymbols
export type IsSingular<Any> =
        c.True<c.Requires<Any, T>> extends true ?
        Any extends any ?

        IsSingularInternal<Any> :

        never :
        c.Requires<Any, T>;

// noinspection JSUnusedGlobalSymbols
export type HasSuffix<Any> =
        c.True<c.Requires<Any, T>> extends true ?
        Any extends any ?

        HasSuffixInternal<Any> :

        never :
        c.Requires<Any, T>;


type ValueOfInternal<Tuple> = Tuple extends (infer Element)[] ? Element : never;

type SizeInternal<Tuple> = c.Cast<Tuple, T>['length'];

// TODO: optimize?
type MaxSizeInternal<Tuple> =
        IsMaybeInifiniteInternal<Tuple> extends true ? number :
        u.Length<IndexOfRecursive<SizeInternal<Tuple>>>;

type IsMaybeInifiniteInternal<Tuple> = c.IsExactly<SizeInternal<Tuple>, number>

type HasFiniteLengthInternal<Tuple> = c.IsGreater<SizeInternal<Tuple>, number>

type IsEmptyInternal<Tuple> =
        c.Maybe<c.Is<SizeInternal<Tuple>, 0>> extends true ? c.IsGreaterOrEqual<Tuple, NonEmptyT> extends true ? false :
                                                             boolean :
        c.Is<SizeInternal<Tuple>, 0>;

type IsFinitelyIterableInternal<Tuple> =
        HasFiniteLengthInternal<Tuple> extends true ? c.Maybe<c.Not<IsEmptyInternal<Tuple>>> extends true ?

                                                      c.Not<c.Strictly<c.Is<SizeInternal<Tuple>, 0>>> :

                                                      c.Not<IsEmptyInternal<Tuple>> :
        false

type IsSingularInternal<Tuple> =
        HasFiniteLengthInternal<Tuple> extends true ? c.Is<SizeInternal<Tuple>, 1> :
        false

type HasSuffixInternal<Tuple> =
        IsFinitelyIterableInternal<Tuple> extends true ? c.Not<c.Strictly<c.Is<SizeInternal<Tuple>, 1 | 0>>> :
        false

type IndexOfInternal<Any> =
        IsMaybeInifiniteInternal<Any> extends true ? number :
        IndexOfRecursive<SizeInternal<Any>>;


type IndexOfRecursive<TupleLength, CurrentTuple = []> =
        TupleLength extends any ?
        {
            recurse: IndexOfRecursive<TupleLength, [Size<CurrentTuple>, ...c.Cast<CurrentTuple, T>]>
            done: ValueOf<CurrentTuple>
        } [ SizeInternal<CurrentTuple> extends TupleLength ? 'done' : 'recurse'] :
        never;


import * as c from '../../../../core/coreTraits';

import * as u from '../../../core/unionTraits';


import environment from '../../../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const elementTypeTest: c.IsExactly<ValueOf<number[]>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const elementTypeTestMixed: c.IsExactly<ValueOf<[number, string]>, number | string> = true;
    // noinspection JSUnusedLocalSymbols
    const elementTypeTestPartial: c.IsExactly<ValueOf<[number, string?]>, number | string | undefined> = true;
    // noinspection JSUnusedLocalSymbols
    const elementTypeTestEmpty: c.IsExactly<ValueOf<EmptyT>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const elementTypeTestNever: c.IsExactly<ValueOf<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const elementTypeTestAny: c.IsExactly<ValueOf<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const elementTypeTestUnknown: c.IsExactly<ValueOf<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const elementTypeTestNeverTuple: c.IsExactly<ValueOf<never[]>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const elementTypeTestNeverInTuple: c.IsExactly<ValueOf<[never]>, never> = true;


    // noinspection JSUnusedLocalSymbols
    const lengthTest: c.IsExactly<Size<[any]>, 1> = true;
    // noinspection JSUnusedLocalSymbols
    const lengthTestIndeterminate: c.IsExactly<Size<number[]>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const lengthTestPartial: c.IsExactly<Size<[number?, string?]>, 0 | 1 | 2> = true;
    // noinspection JSUnusedLocalSymbols
    const lengthTestEmpty: c.IsExactly<Size<EmptyT>, 0> = true;
    // noinspection JSUnusedLocalSymbols
    const lengthTestNever: c.IsExactly<Size<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const lengthTestAny: c.IsExactly<Size<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const lengthTestNeverTuple: c.IsExactly<Size<never[]>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const lengthTestRest: c.IsExactly<Size<[any, ...number[]]>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const lengthTestRestNonempty: c.IsExactly<Size<[any, ...[string, number]]>, 3> = true;
    // noinspection JSUnusedLocalSymbols, LocalVariableNamingConventionJS
    const lengthTestRestNonemptyPartial: c.IsExactly<Size<[any, ...[string, number?]]>, 2 | 3> = true;


    // noinspection JSUnusedLocalSymbols
    const hasLengthTest: c.IsExactly<HasFiniteSize<[any]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const hasLengthTestIndeterminate: c.IsExactly<HasFiniteSize<number[]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const hasLengthTestUnion: c.IsExactly<HasFiniteSize<number[] | null>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const hasLengthTestPartial: c.IsExactly<HasFiniteSize<[number?, string?]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const hasLengthTestEmpty: c.IsExactly<HasFiniteSize<EmptyT>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const hasLengthTestNever: c.IsExactly<HasFiniteSize<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const hasLengthTestNeverTuple: c.IsExactly<HasFiniteSize<never[]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const hasLengthTestRest: c.IsExactly<HasFiniteSize<[number, ...number[]]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const hasLengthTestRestTwice: c.IsExactly<HasFiniteSize<[number, string, ...Tuple<number>, ...string[]]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const hasLengthTestRestNonempty: c.IsExactly<HasFiniteSize<[any, ...[string, number]]>, true> = true;
    // noinspection JSUnusedLocalSymbols, LocalVariableNamingConventionJS
    const hasLengthTestRestNonemptyPartial: c.IsExactly<HasFiniteSize<[any, ...[string, number?]]>, true> = true;

    // noinspection JSUnusedLocalSymbols
    const isLengthlessTest: c.IsExactly<IsMaybeInfinite<[any]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isLengthlessTestIndeterminate: c.IsExactly<IsMaybeInfinite<number[]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isLengthlessTestPartial: c.IsExactly<IsMaybeInfinite<[number?, string?]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isLengthlessTestEmpty: c.IsExactly<IsMaybeInfinite<EmptyT>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isLengthlessTestNever: c.IsExactly<IsMaybeInfinite<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const isLengthlessTestNeverTuple: c.IsExactly<IsMaybeInfinite<never[]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isLengthlessTestRest: c.IsExactly<IsMaybeInfinite<[number, ...number[]]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isLengthlessTestRestTwice: c.IsExactly<IsMaybeInfinite<[number, string, ...Tuple<number>, ...string[]]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isLengthlessTestRestNonempty: c.IsExactly<IsMaybeInfinite<[any, ...[string, number]]>, false> = true;
    // noinspection JSUnusedLocalSymbols, LocalVariableNamingConventionJS
    const isLengthlessTestRestNonemptyPartial: c.IsExactly<IsMaybeInfinite<[any, ...[string, number?]]>, false> = true;

    // noinspection JSUnusedLocalSymbols
    const isEmptyTest: c.IsExactly<IsEmpty<[any]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isEmptyTestIndeterminate: c.IsExactly<IsEmpty<number[]>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const isEmptyTestPartial: c.IsExactly<IsEmpty<[number?, string?]>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const isEmptyTestEmpty: c.IsExactly<IsEmpty<EmptyT>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isEmptyTestNever: c.IsExactly<IsEmpty<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const isEmptyTestAny: c.IsExactly<IsEmpty<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const isEmptyTestVoid: c.IsExactly<IsEmpty<void>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const isEmptyTestNeverTuple: c.IsExactly<IsEmpty<never[]>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const isEmptyTestRest: c.IsExactly<IsEmpty<[number, ...number[]]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isEmptyTestRestTwice: c.IsExactly<IsEmpty<[number, string, ...Tuple<number>, ...string[]]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isEmptyTestRestNonempty: c.IsExactly<IsEmpty<[any, ...[string, number]]>, false> = true;
    // noinspection JSUnusedLocalSymbols, LocalVariableNamingConventionJS
    const isEmptyTestRestNonemptyPartial: c.IsExactly<IsEmpty<[any, ...[string, number?]]>, false> = true;


    // noinspection JSUnusedLocalSymbols
    const isIterableTest: c.IsExactly<IsFinitelyIterable<[any]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isIterableTestTuple: c.IsExactly<IsFinitelyIterable<[number, string]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isIterableTestIndeterminate: c.IsExactly<IsFinitelyIterable<number[]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isIterableTestPartial: c.IsExactly<IsFinitelyIterable<[number?, string?]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isIterableTestIterable: c.IsExactly<IsFinitelyIterable<EmptyT>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isIterableTestNever: c.IsExactly<IsFinitelyIterable<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const isIterableTestAny: c.IsExactly<IsFinitelyIterable<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const isIterableTestVoid: c.IsExactly<IsFinitelyIterable<void>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const isIterableTestNeverTuple: c.IsExactly<IsFinitelyIterable<never[]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isIterableTestRest: c.IsExactly<IsFinitelyIterable<[number, ...number[]]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isIterableTestRestTwice: c.IsExactly<IsFinitelyIterable<[number, string, ...Tuple<number>, ...string[]]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isIterableTestRestNonempty: c.IsExactly<IsFinitelyIterable<[any, ...[string, number]]>, true> = true;
    // noinspection JSUnusedLocalSymbols, LocalVariableNamingConventionJS
    const isIterableTestRestNonemptyPartial: c.IsExactly<IsFinitelyIterable<[any, ...[string, number?]]>, true> = true;

    // noinspection JSUnusedLocalSymbols
    const hasSuffixTestEmpty: c.IsExactly<HasSuffix<EmptyT>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const hasSuffixTestLengthless: c.IsExactly<HasSuffix<number[]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const hasSuffixTestOne: c.IsExactly<HasSuffix<[string]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const hasSuffixTestOnePartial: c.IsExactly<HasSuffix<[string?]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const hasSuffixTestTwo: c.IsExactly<HasSuffix<[string, number]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const hasSuffixTestPartial: c.IsExactly<HasSuffix<[string?, number?]>, true> = true;


    // noinspection JSUnusedLocalSymbols
    const indicesTestEmpty: c.IsExactly<IndexOf<[]>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const indicesTestLengthless: c.IsExactly<IndexOf<number[]>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const indicesTestNonEmpty: c.IsExactly<IndexOf<[any, any, any]>, 0 | 1 | 2> = true;
    // noinspection JSUnusedLocalSymbols
    const indicesTestPartial: c.IsExactly<IndexOf<[any?, boolean?, string?]>, 0 | 1 | 2> = true;

    // noinspection JSUnusedLocalSymbols
    const maxLengthTestEmpty: c.IsExactly<MaxSize<[]>, 0> = true;
    // noinspection JSUnusedLocalSymbols
    const maxLengthTestLengthless: c.IsExactly<MaxSize<number[]>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const maxLengthTestNonEmpty: c.IsExactly<MaxSize<[any, any, any]>, 3> = true;
    // noinspection JSUnusedLocalSymbols
    const maxLengthTestPartial: c.IsExactly<MaxSize<[any?, boolean?, string?]>, 3> = true;
}
