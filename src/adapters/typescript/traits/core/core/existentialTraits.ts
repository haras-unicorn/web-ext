// Wrap in tuple to avoid never pollution
// noinspection JSUnusedGlobalSymbols
export type IsNever<Any> =
        [never] extends [Any] ?
        [Any] extends [never] ? true : false :
        false;
/*
 * unknown extends this ? true : false => false
 * any extends { '__dontTellAnyoneAboutThis': any } ? true : false => boolean
 * any extends any ? true : false => true
 */
type BooleanIfAny<Any> =
        Any extends { '__dontTellAnyoneAboutThis': any } ? true :
        false;
// noinspection JSUnusedGlobalSymbols
export type IsAny<Any> =
        boolean extends BooleanIfAny<Any> ? true :
        false;
// noinspection JSUnusedGlobalSymbols
export type IsUnknown<Any> =
        unknown extends Any ? IsAny<Any> extends true ? false :
                              true :
        false;

// noinspection JSUnusedGlobalSymbols
export type Untyped = any | unknown | never;
// noinspection JSUnusedGlobalSymbols
export type IsUntyped<Any> =
        IsNever<Any> extends true ? true :
        IsUnknown<Any> extends true ? true :
        IsAny<Any> extends true ? true :
        false;
// noinspection JSUnusedGlobalSymbols
export type IsTyped<Any> =
        IsUntyped<Any> extends true ? false :
        true;


// noinspection JSUnusedGlobalSymbols
export type NotRequired = undefined;

// noinspection JSUnusedGlobalSymbols
export type IsMaybeRequired<Any> =
        IsAny<Any> extends true ? true :
        IsUnknown<Any> extends true ? true :
        false;
// noinspection JSUnusedGlobalSymbols
export type IsRequired<Any> =
        IsMaybeRequired<Any> extends true ? boolean :
        IsNever<Extract<Any, NotRequired>> extends true ? true :
        false;
// noinspection JSUnusedGlobalSymbols
export type ToRequired<Any> = Exclude<Any, NotRequired>


// noinspection JSUnusedGlobalSymbols
export type NonExistent = null | undefined | void | never;

// noinspection JSUnusedGlobalSymbols
export type IsMaybeExistent<Any> =
        IsAny<Any> extends true ? true :
        IsUnknown<Any> extends true ? true :
        IsNever<Exclude<Any, NonExistent>> extends false ? IsNever<Extract<Any, NonExistent>> extends true ? false :
                                                           true :
        false;
// noinspection JSUnusedGlobalSymbols
export type IsExistent<Any> =
        IsNever<Any> extends true ? false :
        IsMaybeExistent<Any> extends true ? boolean :
        Any extends NonExistent ? false :
        true;
// noinspection JSUnusedGlobalSymbols
export type IsNonExistent<Any> =
        boolean extends IsExistent<Any> ? boolean :
        IsExistent<Any> extends true ? false :
        true;
// noinspection JSUnusedGlobalSymbols
export type Purify<Any> =
        IsExistent<Any> extends true ? Any :
        IsMaybeExistent<Any> extends true ? Exclude<Any, NonExistent> :
        never;


// noinspection JSUnusedGlobalSymbols
export type Cast<This, Type> = This extends Type ? This : Type;

// noinspection JSUnusedGlobalSymbols
export type Compute<Any> =
        IsAny<Any> extends true ? any :
        IsUnknown<Any> extends true ? unknown :
        { [Key in keyof Any]: Compute<Any[Key]> } extends infer Result ? Result :
        never


// TESTS
import environment from '../../../../../environments/active';

// TODO: Cast and Compute tests
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const isNeverTestNever: IsNever<never> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isNeverTestAny: IsNever<any> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isNeverTestUnknown: IsNever<unknown> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isNeverTestUnion: IsNever<number | string> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isNeverTestIntersection: IsNever<{ a: 1 } & { b: 1 }> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isNeverTestNumber: IsNever<number> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isNeverTestTrue: IsNever<true> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isNeverTestFalse: IsNever<false> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isNeverTestBoolean: IsNever<boolean> extends true ? true : false = false;

    // noinspection JSUnusedLocalSymbols
    const isUnknownTestNever: IsUnknown<never> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isUnknownTestAny: IsUnknown<any> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isUnknownTestUnknown: IsUnknown<unknown> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isUnknownTestUnion: IsUnknown<number | string> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isUnknownTestIntersection: IsUnknown<{ a: 1 } & { b: 1 }> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isUnknownTestNumber: IsUnknown<number> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isUnknownTestTrue: IsUnknown<true> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isUnknownTestFalse: IsUnknown<false> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isUnknownTestBoolean: IsUnknown<boolean> extends true ? true : false = false;

    // noinspection JSUnusedLocalSymbols
    const isAnyTestNever: IsAny<never> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isAnyTestAny: IsAny<any> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isAnyTestUnknown: IsAny<unknown> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isAnyTestUnion: IsAny<number | string> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isAnyTestIntersection: IsAny<{ a: 1 } & { b: 1 }> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isAnyTestNumber: IsAny<number> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isAnyTestTrue: IsAny<true> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isAnyTestFalse: IsAny<false> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isAnyTestBoolean: IsAny<boolean> extends true ? true : false = false;

    // noinspection JSUnusedLocalSymbols
    const isUntypedTestNever: IsUntyped<never> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isUntypedTestUnknown: IsUntyped<unknown> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isUntypedTestAny: IsUntyped<any> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isUntypedTestNull: IsUntyped<null> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isUntypedTestUnion: IsUntyped<number | string> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isUntypedTestIntersection: IsUntyped<{ a: 1 } & { b: 1 }> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isUntypedTestNumber: IsUntyped<number> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isUntypedTestTrue: IsAny<true> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isUntypedTestFalse: IsAny<false> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isUntypedTestBoolean: IsAny<boolean> extends true ? true : false = false;


    // noinspection JSUnusedLocalSymbols
    const isRequiredTestNever: IsRequired<never> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isRequiredTestUnknown: boolean extends IsRequired<unknown> ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isRequiredTestAny: boolean extends IsRequired<any> ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isRequiredTestUndefined: IsRequired<undefined> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isRequiredTestUnion: IsRequired<number | string> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isRequiredTestUnionFalse: IsRequired<number | string | undefined> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isRequiredTestIntersection: IsRequired<{ a: 1 } & { b: 1 }> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isRequiredTestNumber: IsRequired<number> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isRequiredTestTrue: IsRequired<true> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isRequiredTestFalse: IsRequired<false> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isRequiredTestBoolean: IsRequired<boolean> extends true ? true : false = true;


    // noinspection JSUnusedLocalSymbols
    const isExistentTestNever: IsExistent<never> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isExistentTestUnknown: boolean extends IsExistent<unknown> ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isExistentTestAny: boolean extends IsExistent<any> ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isExistentTestNull: IsExistent<null> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isExistentTestUnion: IsExistent<number | string> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isExistentTestUnionMaybe: boolean extends IsExistent<number | string | null> ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isExistentTestUnionFalse: IsExistent<undefined | null> extends true ? true : false = false;
    // noinspection JSUnusedLocalSymbols
    const isExistentTestIntersection: IsExistent<{ a: 1 } & { b: 1 }> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isExistentTestTrue: IsExistent<true> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isExistentTestFalse: IsExistent<false> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isExistentTestBoolean: IsExistent<boolean> extends true ? true : false = true;


    // noinspection JSUnusedLocalSymbols
    const purifyTestNumber: Purify<number | string | null> extends number | string ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const purifyTestAny: Purify<any | undefined | null | void> extends any ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const purifyTestNever: IsNever<Purify<never>> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const purifyTestUnknown: IsUnknown<Purify<unknown | undefined>> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const purifyTestNull: IsNever<Purify<null>> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const purifyTestNullUndefined: IsNever<Purify<null | undefined>> extends true ? true : false = true;


    // noinspection JSUnusedLocalSymbols
    const computeTestNever: IsNever<Compute<never>> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const computeTestAny: IsAny<Compute<any>> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const computeTestUnknown: IsUnknown<Compute<unknown>> extends true ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const computeTestNull: null extends Compute<null> ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const computeTestVoid: void extends Compute<void> ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const computeTestUndefined: undefined extends Compute<undefined> ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const computeTestPrimitive: number extends Compute<number> ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const computeTestObject: object extends Compute<object> ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const computeTestMap: { a: { b: string } } extends Compute<{ a: { b: string } }> ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const computeTestTuple: [number, string] extends Compute<[number, string]> ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const computeTestIntersection:
            { a: { b: string } } extends Compute<{ a: { b: undefined | string } } & { a: { b: string } }> ?
            true : false = true;
    // noinspection JSUnusedLocalSymbols
    const computeTestUnion:
            { a: { b: undefined } } extends Compute<{ a: { b: undefined | string } } | { a: { b: string } }> ?
            true : false = true;
}
