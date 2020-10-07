// noinspection JSUnusedGlobalSymbols
export type IsUnion<Any> = c.Not<c.IsExactly<OneOfInternal<Any>, Any>>;

// noinspection JSUnusedGlobalSymbols
export type Has<Any, Type> = c.Is<Type, Any>;

// noinspection JSUnusedGlobalSymbols
export type Length<Any> = e.IsNever<Any> extends true ? 0 : ToTupleInternal<Any>['length'];
// noinspection JSUnusedGlobalSymbols
export type EmptyUnion = never;
// noinspection JSUnusedGlobalSymbols
export type IsEmpty<Any> = e.IsNever<Any>;

// noinspection JSUnusedGlobalSymbols
export type OneOf<Any> = OneOfInternal<Any>;
// noinspection JSUnusedGlobalSymbols
export type Rest<Any> = Exclude<Any, OneOfInternal<Any>>;

// noinspection JSUnusedGlobalSymbols
export type ToIntersection<Any> = ToIntersectionInternal<Any>;
// noinspection JSUnusedGlobalSymbols
export type ToTuple<Any> = ToTupleInternal<Any>;


type ToIntersectionBare<Any> = Consumer<Any> extends Consumer<infer Intersection> ? Intersection : never
type ToIntersectionInternal<Any> = AddBooleanAndCheckNever<Any, ToIntersectionBare<Exclude<Any, boolean>>>

type OneOfBare<Any> = ToIntersection<Consumer<Any>> extends Consumer<infer OneOf> ? OneOf : never
type OneOfInternal<Any> = AddBooleanAndCheckNever<Any, OneOfBare<Exclude<Any, boolean>>>


type ToTupleInternal<Any> =
        {
            anyIsUnion:
                    ToTuple<Rest<Any>> extends any[] ?
                    [OneOf<Any>, ...ToTuple<Rest<Any>>] :
                    [OneOf<Any>, ToTuple<Rest<Any>>]

            anyIsNotUnion: [Any]

        } [c.If<IsUnion<Any>, 'anyIsUnion', 'anyIsNotUnion'>]


type Consumer<Any> =
        Any extends any ?
        (arg: Any) => void :
        never;

type AddBooleanAndCheckNever<Union, Intersection> =
        e.IsNever<Union> extends true ? never :
        c.IsGreaterOrEqual<Extract<Union, boolean>, boolean> extends true ? Extract<Union, boolean> & Intersection :
        Intersection


import * as e from '../../core/existentialTraits';
import * as c from '../../core/conditionalTraits';

// TESTS
import environment from '../../../../../../environments/active';

if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const isUnionTest: c.IsExactly<IsUnion<number | string>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isUnionTestNever: c.IsExactly<IsUnion<never>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isUnionTestAny: c.IsExactly<IsUnion<any>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isUnionTestUnknown: c.IsExactly<IsUnion<unknown>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isUnionTestBoolean: c.IsExactly<IsUnion<boolean>, false> = true;
    // NOTE: This is due to how TS treats boolean and there is nothing I can do about it right now.
    // noinspection JSUnusedLocalSymbols
    const isUnionTestTrueFalse: c.IsExactly<IsUnion<true | false>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isUnionTestObjects: c.IsExactly<IsUnion<{ a: 1 } | { b: 2 }>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isUnionTestObject: c.IsExactly<IsUnion<{ a: 1 }>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isUnionTestFunctions:
            c.IsExactly<IsUnion<((arg: number) => number) | ((arg: string) => string)>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isUnionTestFunction:
            c.IsExactly<IsUnion<((arg: number) => number) & ((arg: string) => string)>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isUnionTestCallSignatures:
            c.IsExactly<IsUnion<{ (arg: number): number, (arg: string): string }>, false> = true;

    // noinspection JSUnusedLocalSymbols
    const hasTestExact: c.IsExactly<Has<string | number, number>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const hasTestGreater: c.IsExactly<Has<string | number, 1>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const hasTestLessser: c.IsExactly<Has<string | 1, number>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const hasTestIncomparable: c.IsExactly<Has<string | 1, 2>, false> = true;


    // noinspection JSUnusedLocalSymbols
    const tailTest: c.IsGreater<OneOf<1 | 2 | 3>, 1 | 2 | 3> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestNever: c.IsExactly<OneOf<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestAny: c.IsExactly<OneOf<any>, any> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestUnknown: c.IsExactly<OneOf<unknown>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestBoolean: c.IsExactly<OneOf<boolean>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestTrue: c.IsExactly<OneOf<true>, true> = true;
    // NOTE: This is due to how TS treats boolean and there is nothing I can do about it right now.
    // noinspection JSUnusedLocalSymbols
    const tailTestTrueFalse: c.IsExactly<OneOf<true | false>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestObject: c.IsGreater<OneOf<{ a: 1 } | { b: 2 }>, { a: 1 } | { b: 2 }> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestFunction:
            c.IsGreater<OneOf<((arg: number) => number) | ((arg: string) => string)>,
                    ((arg: number) => number) | ((arg: string) => string)> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestIntersection:
            c.IsExactly<OneOf<((arg: number) => number) & ((arg: string) => string)>,
                    ((arg: number) => number) & ((arg: string) => string)> = true;
    // noinspection JSUnusedLocalSymbols
    const tailTestCallSignatures:
            c.IsExactly<OneOf<{ (arg: number): number, (arg: string): string }>,
                    { (arg: number): number, (arg: string): string }> = true;


    // noinspection JSUnusedLocalSymbols
    const toIntersectionTest: c.IsExactly<ToIntersection<{ a: 1 } | { b: 2 }>, { a: 1, b: 2 }> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestNever: c.IsExactly<ToIntersection<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestAny: c.IsExactly<ToIntersection<any>, any> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestUnknown: c.IsExactly<ToIntersection<unknown>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestNull: c.IsExactly<ToIntersection<null>, null> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestNumber: c.IsExactly<ToIntersection<number>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestIntersection: c.IsExactly<ToIntersection<{ a: 1 } & { b: 2 }>, { a: 1, b: 2 }> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestOne: c.IsExactly<ToIntersection<1>, 1> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestNeverResult: c.IsExactly<ToIntersection<boolean | 1>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestBoolean: c.IsExactly<ToIntersection<boolean>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestTrueFalse: c.IsExactly<ToIntersection<true | false>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestTrue: c.IsExactly<ToIntersection<true>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const toIntersectionTestFunction:
            c.IsExactly<ToIntersection<((arg: number) => number) | ((arg: string) => string)>,
                    { (arg: number): number, (arg: string): string }> = true;
    // noinspection JSUnusedLocalSymbols, LocalVariableNamingConventionJS
    const toIntersectionTestFunctionIntersection:
            c.IsExactly<ToIntersection<((arg: number) => number) & ((arg: string) => string)>,
                    { (arg: number): number, (arg: string): string }> = true;
    // noinspection JSUnusedLocalSymbols, LocalVariableNamingConventionJS
    const toIntersectionTestCallSignatures:
            c.IsExactly<ToIntersection<{ (arg: number): number, (arg: string): string }>,
                    { (arg: number): number, (arg: string): string }> = true;

    // noinspection JSUnusedLocalSymbols
    const toTupleTest: c.IsGreater<ToTuple<string | number>, [string, number] | [number, string]> = true;
    // noinspection JSUnusedLocalSymbols
    const toTupleTestNever: c.IsExactly<ToTuple<never>, [never]> = true;
    // noinspection JSUnusedLocalSymbols
    const toTupleTestAny: c.IsExactly<ToTuple<any>, [any]> = true;
    // noinspection JSUnusedLocalSymbols
    const toTupleTestUnknown: c.IsExactly<ToTuple<unknown>, [unknown]> = true;
    // noinspection JSUnusedLocalSymbols
    const toTupleTestBoolean: c.IsExactly<ToTuple<boolean>, [boolean]> = true;
    // NOTE: This is due to how TS treats boolean and there is nothing I can do about it right now.
    // noinspection JSUnusedLocalSymbols
    const toTupleTestTrueFalse: c.IsExactly<ToTuple<true | false>, [boolean]> = true;
    // noinspection JSUnusedLocalSymbols
    const toTupleTestObjects:
            c.IsGreater<ToTuple<{ a: 1 } | { b: 2 }>,
                    [{ a: 1 }, { b: 2 }] | [{ b: 2 }, { a: 1 }]> = true;
    // noinspection JSUnusedLocalSymbols
    const toTupleTestObject: c.IsExactly<ToTuple<{ a: 1 }>, [{ a: 1 }]> = true;
    // noinspection JSUnusedLocalSymbols
    const toTupleTestFunctions:
            c.IsGreater<ToTuple<((arg: number) => number) | ((arg: string) => string)>,
                    [((arg: number) => number), ((arg: string) => string)] |
                    [((arg: string) => string), ((arg: number) => number)]> = true;
    // noinspection JSUnusedLocalSymbols
    const toTupleTestFunction:
            c.IsExactly<ToTuple<((arg: number) => number) & ((arg: string) => string)>,
                    [((arg: number) => number) & ((arg: string) => string)]> = true;
    // noinspection JSUnusedLocalSymbols
    const toTupleTestCallSignatures:
            c.IsExactly<ToTuple<{ (arg: number): number, (arg: string): string }>,
                    [{ (arg: number): number, (arg: string): string }]> = true;
}
