// noinspection JSUnusedGlobalSymbols
import * as e from './existentialTraits';
import { IsNever } from './existentialTraits';

// TESTS
import environment from '../../../../../environments/active';

export type Strictly<Any> =
        e.IsUntyped<Any> extends true ? never :
        [Any] extends [true] ? true :
        false
// noinspection JSUnusedGlobalSymbols
export type Loosely<Any> =
        e.IsNever<Any> extends true ? never :
        e.IsUntyped<Any> extends true ? true :
        [Any] extends [false] ? false :
        true

// noinspection JSUnusedGlobalSymbols
export type ToBoolean<Any> =
        e.IsMaybeExistent<Any> extends true ? e.Purify<Any> extends false ? false :
                                              boolean :
        e.IsExistent<Any> extends true ? Any extends false ? false :
                                         boolean extends Any ? boolean :
                                         true :
        false


// noinspection JSClassNamingConvention, JSUnusedGlobalSymbols
export type If<Condition, This, IfNotThat> =
        boolean extends ToBoolean<Condition> ? This | IfNotThat :
        ToBoolean<Condition> extends true ? This : IfNotThat

// noinspection JSClassNamingConvention, JSUnusedGlobalSymbols
export type Not<This> = If<This, false, true>


// noinspection JSUnusedGlobalSymbols
export type True<Any> = ToBoolean<Any>;
// noinspection JSUnusedGlobalSymbols
export type False<Any> = Not<ToBoolean<Any>>
// noinspection JSUnusedGlobalSymbols
export type Maybe<Any> =
        boolean extends ToBoolean<Any> ? true :
        false


// https://stackoverflow.com/a/52473108/3570903
type IsExactlyGeneric<This, Type> =
        (<A>() => A extends This ? true : false) extends (<A>() => A extends Type ? true : false) ? true :
        false

type IsExactlyExtends<This, Type> =
        e.IsAny<This> extends true ? e.IsAny<Type> extends true ? true :
                                     false :
        e.IsAny<Type> extends true ? false :
        [This] extends [Type] ? [Type] extends [This] ? true :
                                false :
        false

// noinspection JSClassNamingConvention, JSUnusedGlobalSymbols
export type IsExactly<This, Type, UseExtends = never> =
        IsNever<UseExtends> extends true ? IsExactlyGeneric<e.Compute<This>, e.Compute<Type>> :
        IsExactlyExtends<This, Type>

// noinspection JSUnusedGlobalSymbols
export type IsMaybeExactly<This, Type> =
        e.IsAny<This> extends true ? true :
        e.IsUnknown<This> extends true ? true :
        e.IsNever<This> extends true ? false :
        e.IsNever<Type> extends true ? false :
        e.IsNever<Exclude<This, Type>> extends false ? IsExactly<Extract<This, Type>, Type> extends true ? true :
                                                       false :
        false
// noinspection JSUnusedGlobalSymbols
export type IsMaybe<This, Type> =
        IsMaybeExactly<This, Type> extends true ? true :
        e.IsNever<Exclude<This, Type>> extends false ? e.IsNever<Extract<This, Type>> extends false ? true :
                                                       false :
        false


// noinspection JSUnusedGlobalSymbols
export type IsGreaterOrEqual<This, Type> =
        e.IsNever<This> extends true ? e.IsNever<Type> :
        e.IsNever<Type> extends true ? false :
        IsMaybe<This, Type> extends true ? boolean :
        [This] extends [Type] ? true : false;
// noinspection JSUnusedGlobalSymbols
export type IsGreater<This, Type> =
        e.IsNever<This> extends true ? false :
        e.IsNever<Type> extends true ? false :
        IsMaybeExactly<This, Type> extends true ? false :
        IsMaybe<This, Type> extends true ? boolean :
        [This] extends [Type] ? Not<IsExactly<This, Type>> : false;
// noinspection JSUnusedGlobalSymbols
export type IsLesserOrEqual<This, Type> =
        e.IsNever<This> extends true ? e.IsNever<Type> :
        e.IsNever<Type> extends true ? false :
        IsMaybe<Type, This> extends true ? boolean :
        [Type] extends [This] ? true : false
// noinspection JSUnusedGlobalSymbols
export type IsLesser<This, Type> =
        e.IsNever<This> extends true ? false :
        e.IsNever<Type> extends true ? false :
        IsMaybeExactly<Type, This> extends true ? false :
        IsMaybe<Type, This> extends true ? boolean :
        [Type] extends [This] ? Not<IsExactly<This, Type>> : false


type CheckBoolean<This, That, IfNotBoolean> =
        If<IsExactly<This, boolean>,
                boolean,
                If<IsExactly<That, boolean>,
                        boolean,
                        IfNotBoolean>>
// noinspection JSClassNamingConvention, JSUnusedGlobalSymbols
export type Or<This, That> =
        If<This, true,
                If<That, true,
                        CheckBoolean<This, That, false>>>
// noinspection JSClassNamingConvention, JSUnusedGlobalSymbols
export type And<This, That> =
        If<Not<This>, false,
                If<Not<That>, false,
                        CheckBoolean<This, That, true>>>


// noinspection JSUnusedGlobalSymbols, JSClassNamingConvention
export type Is<This, Type> =
        Or<IsGreaterOrEqual<This, Type>, IsLesser<This, Type> extends true ? boolean :
                                         IsLesser<This, Type>>


// noinspection JSUnusedGlobalSymbols
export type Requires<Any, Type, Union = never> =
        Is<Any, Type> extends true ? true :
        e.IsNever<Any> extends true ? e.IsNever<Union> extends true ? never :
                                      true :
        Maybe<Is<Any, Type>> extends true ? unknown :
        never;


// noinspection JSUnusedGlobalSymbols
export type Try<This, IfNotThat> =
        Not<e.IsNever<This>> extends true ? This :
        IfNotThat
// noinspection JSUnusedGlobalSymbols
export type TryTrue<This, IfNotThat> =
        True<This> extends true ? This :
        True<IfNotThat> extends true ? IfNotThat :
        never


if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const strictlyTestAny: IsExactly<Strictly<any>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const strictlyTestTrue: IsExactly<Strictly<true>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const strictlyTestString: IsExactly<Strictly<string>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const strictlyTestBoolean: IsExactly<Strictly<boolean>, false> = true;

    // noinspection JSUnusedLocalSymbols
    const looselyTestAny: IsExactly<Loosely<any>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const looselyTestTrue: IsExactly<Loosely<true>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const looselyTestString: IsExactly<Loosely<string>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const looselyTestFalse: IsExactly<Loosely<false>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const looselyTestBoolean: IsExactly<Loosely<boolean>, true> = true;

    // noinspection JSUnusedLocalSymbols
    const toBooleanTestTrue: IsExactly<ToBoolean<true>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const toBooleanTestFalse: IsExactly<ToBoolean<false>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const toBooleanTestBoolean: IsExactly<ToBoolean<boolean>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const toBooleanTestAny: IsExactly<ToBoolean<any>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const toBooleanTestUnknown: IsExactly<ToBoolean<unknown>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const toBooleanTestNever: IsExactly<ToBoolean<never>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const toBooleanTestNull: IsExactly<ToBoolean<null>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const toBooleanTestOther: IsExactly<ToBoolean<number>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const toBooleanTestUnion: IsExactly<ToBoolean<string | undefined>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const toBooleanTestUnionFalse: IsExactly<ToBoolean<undefined | false>, false> = true;

    // noinspection JSUnusedLocalSymbols
    const ifTestTrue: IsExactly<If<true, string, number>, string> = true;
    // noinspection JSUnusedLocalSymbols
    const ifTestFalse: IsExactly<If<false, string, number>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const ifTestNever: IsExactly<If<never, string, number>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const ifTestAny: IsExactly<If<any, string, number>, string | number> = true;
    // noinspection JSUnusedLocalSymbols
    const ifTestBoolean: IsExactly<If<boolean, string, number>, string | number> = true;
    // noinspection JSUnusedLocalSymbols
    const ifTestUnion: IsExactly<If<string | undefined, string, number>, string | number> = true;
    // noinspection JSUnusedLocalSymbols
    const ifTestNeverFirst: IsExactly<If<true, string, never>, string> = true;
    // noinspection JSUnusedLocalSymbols
    const ifTestNeverSecond: IsExactly<If<false, never, number>, number> = true;

    // noinspection JSUnusedLocalSymbols
    const notTestTrue: IsExactly<Not<true>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const notTestFalse: IsExactly<Not<false>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const notTestBoolean: IsExactly<Not<boolean>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const notTestAny: IsExactly<Not<any>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const notTestNever: IsExactly<Not<never>, true> = true;


    // noinspection JSUnusedLocalSymbols
    const isExactlyTestAnyUnknown: IsExactly<IsExactly<any, unknown>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isExactlyTestAnyUnknownReverse: IsExactly<IsExactly<unknown, any>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isExactlyTestAnyAny: IsExactly<IsExactly<any, any>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isExactlyTestAny: IsExactly<IsExactly<any, number>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isExactlyTestUnknown: IsExactly<IsExactly<unknown, number>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isExactlyTestUnknownType: IsExactly<IsExactly<number, unknown>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isExactlyTestAnyType: IsExactly<IsExactly<number, any>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isExactlyTestGreater: IsExactly<IsExactly<1, number>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isExactlyTestEqual: IsExactly<IsExactly<number, number>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isExactlyTestLesser: IsExactly<IsExactly<number, 1>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isExactlyTestUnrelated: IsExactly<IsExactly<string, number>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isExactlyTestUnionFalse: IsExactly<IsExactly<string | number, number | symbol>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isExactlyTestUnionTrue: IsExactly<IsExactly<string | number, number | string>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isExactlyTestBoolean: IsExactly<IsExactly<true, boolean>, false> = true;


    // noinspection JSUnusedLocalSymbols
    const greaterTestGreater: IsExactly<IsGreater<1, number>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterTestEqual: IsExactly<IsGreater<number, number>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterTestLesser: IsExactly<IsGreater<number, 1>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterTestNever: IsExactly<IsGreater<never, 1>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterTestNeverType: IsExactly<IsGreater<1, never>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterTestNeverDouble: IsExactly<IsGreater<never, never>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterTestAny: IsExactly<IsGreater<any, 1>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterTestUnknown: IsExactly<IsGreater<unknown, 1>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterTestAnyType: IsExactly<IsGreater<1, any>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterTestUnknownType: IsExactly<IsGreater<1, unknown>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterTestUnion: IsExactly<IsGreaterOrEqual<1 | 2, 2 | 3>, boolean> = true;

    // noinspection JSUnusedLocalSymbols
    const greaterOrEqualTestGreater: IsExactly<IsGreaterOrEqual<1, number>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterOrEqualTestEqual: IsExactly<IsGreaterOrEqual<number, number>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterOrEqualTestLesser: IsExactly<IsGreaterOrEqual<number, 1>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterOrEqualTestNever: IsExactly<IsGreaterOrEqual<never, 1>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterOrEqualTestNeverType: IsExactly<IsGreaterOrEqual<1, never>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterOrEqualTestNeverDouble: IsExactly<IsGreaterOrEqual<never, never>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterOrEqualTestAny: IsExactly<IsGreaterOrEqual<any, 1>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterOrEqualTestUnknown: IsExactly<IsGreaterOrEqual<unknown, 1>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterOrEqualTestAnyType: IsExactly<IsGreaterOrEqual<1, any>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterOrEqualTestUnknownType: IsExactly<IsGreaterOrEqual<1, unknown>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const greaterOrEquaTestUnion: IsExactly<IsGreater<1 | 2, 2 | 3>, boolean> = true;

    // noinspection JSUnusedLocalSymbols
    const lesserOrEqualTestGreater: IsExactly<IsLesserOrEqual<1, number>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserOrEqualTestEqual: IsExactly<IsLesserOrEqual<number, number>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserOrEqualTestLesser: IsExactly<IsLesserOrEqual<number, 1>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserOrEqualTestNever: IsExactly<IsLesserOrEqual<never, 1>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserOrEqualTestNeverType: IsExactly<IsLesserOrEqual<1, never>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserOrEqualTestNeverDouble: IsExactly<IsLesserOrEqual<never, never>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserOrEqualTestAny: IsExactly<IsLesserOrEqual<any, 1>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserOrEqualTestUnknown: IsExactly<IsLesserOrEqual<unknown, 1>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserOrEqualTestAnyType: IsExactly<IsLesserOrEqual<1, any>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserOrEqualTestUnknownType: IsExactly<IsLesserOrEqual<1, unknown>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserOrEqualTestUnion: IsExactly<IsLesserOrEqual<1 | 2, 2 | 3>, boolean> = true;

    // noinspection JSUnusedLocalSymbols
    const lesserTestGreater: IsExactly<IsLesser<1, number>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserTestEqual: IsExactly<IsLesser<number, number>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserTestLesser: IsExactly<IsLesser<number, 1>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserTestNever: IsExactly<IsLesser<never, 1>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserTestNeverType: IsExactly<IsLesser<1, never>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserTestNeverDouble: IsExactly<IsLesser<never, never>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserTestAny: IsExactly<IsLesser<any, 1>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserTestUnknown: IsExactly<IsLesser<unknown, 1>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserTestAnyType: IsExactly<IsLesser<1, any>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserTestUnknownType: IsExactly<IsLesser<1, unknown>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const lesserTestUnion: IsExactly<IsLesser<1 | 2, 2 | 3>, boolean> = true;


    // noinspection JSUnusedLocalSymbols
    const orTestTrue: IsExactly<Or<true, false>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const orTestFalse: IsExactly<Or<false, false>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const orTestBooleanTrue: IsExactly<Or<boolean, true>, true> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const orTestBooleanFalse: IsExactly<Or<boolean, false>, boolean> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const orTestBoolean: IsExactly<Or<boolean, boolean>, boolean> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const orTestAnyTrue: IsExactly<Or<any, true>, true> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const orTestAnyFalse: IsExactly<Or<any, false>, boolean> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const orTestAnyBoolean: IsExactly<Or<any, boolean>, boolean> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const orTestNeverFalse: IsExactly<Or<never, false>, false> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const orTestNeverTrue: IsExactly<Or<never, true>, true> = true;

    // noinspection JSUnusedLocalSymbols
    const andTestTrue: IsExactly<And<true, true>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const andTestFalse: IsExactly<And<true, false>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const andTestBooleanTrue: IsExactly<And<boolean, true>, boolean> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const andTestBooleanFalse: IsExactly<And<boolean, false>, false> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const andTestBoolean: IsExactly<And<boolean, boolean>, boolean> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const andTestAnyTrue: IsExactly<And<any, true>, boolean> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const andTestAnyFalse: IsExactly<And<any, false>, false> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const andTestAnyBoolean: IsExactly<And<any, boolean>, boolean> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const andTestNeverFalse: IsExactly<And<never, false>, false> = true;
    // noinspection JSUnusedLocalSymbols, JSMismatchedCollectionQueryUpdate
    const andTestNeverTrue: IsExactly<And<never, true>, false> = true;


    // noinspection JSUnusedLocalSymbols
    const tryTestFirst: IsExactly<Try<number, never>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const tryTestSecond: IsExactly<Try<never, number>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const tryTestNever: IsExactly<Try<never, never>, never> = true;

    // noinspection JSUnusedLocalSymbols
    const tryStrictTestFirst: IsExactly<TryTrue<string, number>, string> = true;
    // noinspection JSUnusedLocalSymbols
    const tryStrictTestNull: IsExactly<TryTrue<null, number>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const tryStrictTestAny: IsExactly<TryTrue<any, number>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const tryStrictTestUnkown: IsExactly<TryTrue<unknown, number>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const tryStrictTestAnyUnkown: IsExactly<TryTrue<unknown, any>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const tryStrictTestUnion: IsExactly<TryTrue<string | null, number>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const tryStrictTestNever: IsExactly<TryTrue<null, undefined>, never> = true;

    // noinspection JSUnusedLocalSymbols
    const isTestAny: IsExactly<Is<any, 2>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const isTestNever: IsExactly<Is<never, 2>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isTestNull: IsExactly<Is<null, 2>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isTestMixed: IsExactly<Is<null | 2, 2>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const isTestTrue: IsExactly<Is<1.0, 1.0>, true> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS
    const isTestFalse: IsExactly<Is<1, 2>, false> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS
    const isTestBoolean: IsExactly<Is<1 | 2, 2>, boolean> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS
    const isTestUnion: IsExactly<Is<1 | 2, 2 | 3>, boolean> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS
    const isTestNumber: IsExactly<Is<number, 2 | 3>, boolean> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS
    const isTestUnionTwo: IsExactly<Is<1, 2 | 1>, true> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS, LocalVariableNamingConventionJS
    const isTestUnionNonExact: IsExactly<Is<number | string, 2 | 1 | symbol>, boolean> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS
    const isTestNonExact: IsExactly<Is<1 | 2 | 'a', number | 'a'>, true> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS, LocalVariableNamingConventionJS
    const isTestNonExactBoolean: IsExactly<Is<1 | 2 | 'a', symbol | 'a'>, boolean> = true;

    // noinspection JSUnusedLocalSymbols
    const requiresTestAny: IsExactly<Requires<any, number>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const requiresTestUnknown: IsExactly<Requires<unknown, number>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const requiresTestNever: IsExactly<Requires<never, number>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const requiresTestUnion: IsExactly<Requires<string | 1, number | symbol>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const requiresTestUnionRequirement: IsExactly<Requires<1, number | symbol>, true> = true;
}
