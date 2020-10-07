// noinspection JSUnusedGlobalSymbols
export type Call<Any, Tuple> = CallFunctionInternal<Any, Tuple>

// noinspection JSUnusedGlobalSymbols
export const hasSuffix: unique symbol = Symbol('Tuple has a suffix (or prefix).');
// noinspection JSUnusedGlobalSymbols
export const isSingular: unique symbol = Symbol('Tuple has exactly one element.');

// noinspection JSUnusedGlobalSymbols
export interface RestFunction
{
    [hasSuffix]: any
    [isSingular]: any
}

// noinspection JSUnusedGlobalSymbols
export const condition: unique symbol = Symbol('True when the function should recurse.');
// noinspection JSUnusedGlobalSymbols
export const recurse: unique symbol = Symbol('Selected when the condition is true.');
// noinspection JSUnusedGlobalSymbols
export const done: unique symbol = Symbol('Selected when the condition is false.');

// noinspection JSUnusedGlobalSymbols
export interface RecursiveFunction
{
    [condition]: any
    [recurse]: any
    [done]: any
}

// noinspection JSUnusedGlobalSymbols
export type SizedFunction = RestFunction | RecursiveFunction

// noinspection JSUnusedGlobalSymbols
export const isEmpty: unique symbol = Symbol('Tuple is empty.');
// noinspection JSUnusedGlobalSymbols
export const isMaybeInfinite: unique symbol = Symbol('Tuple is maybe infinite.');
// noinspection JSUnusedGlobalSymbols
export const isFinitelyIterable: unique symbol = Symbol('Tuple is empty.');

// noinspection JSUnusedGlobalSymbols
export interface Function
{
    [isEmpty]: any,
    [isMaybeInfinite]: any,
    [isFinitelyIterable]: any
}


type CallFunctionInternal<Any, Tuple> =
        IsFunction<Any> extends true ? b.IsMaybeInfinite<Tuple> extends true ?
                                       CallRecursiveFunction<Get<Any, typeof isMaybeInfinite>> :

                                       b.IsEmpty<Tuple> extends true ?
                                       CallRecursiveFunction<Get<Any, typeof isEmpty>> :

                                       CallSizedFunction<Get<Any, typeof isFinitelyIterable>, Tuple> :
        b.IsMaybeInfinite<Tuple> extends true ? CallRecursiveFunction<Any> :
        b.IsEmpty<Tuple> extends true ? never :
        CallSizedFunction<Any, Tuple>

type CallSizedFunction<Any, Tuple> =
        IsSizedFunction<Any> extends true ? IsRestFunction<Any> extends true ? CallRestFunction<Any, Tuple> :
                                            CallRecursiveFunction<Any> :
        Any

type CallRecursiveFunction<Any> =
        IsRecursiveFunction<Any> extends true ? c.ToBoolean<Get<Any, typeof condition>> extends true ?

                                                Get<Any, typeof recurse> :

                                                Get<Any, typeof done> :
        Any

type CallRestFunction<Any, Tuple> =
        IsRestFunction<Any> extends true ? b.HasSuffix<Tuple> extends true ? Get<Any, typeof hasSuffix> :
                                           Get<Any, typeof isSingular> :
        b.HasSuffix<Tuple> extends true ? never :
        never


type IsFunction<Any> =
        IsNotEmpty<Any, typeof isEmpty> extends true ? IsNotEmpty<Any, typeof isMaybeInfinite> extends true ?

                                                       IsNotEmpty<Any, typeof isFinitelyIterable> extends true ? true :
                                                       false :

                                                       false :
        false

type IsSizedFunction<Any> = c.Or<IsRestFunction<Any>, IsRecursiveFunction<Any>>

type IsRecursiveFunction<Any> =
        IsNotEmpty<Any, typeof condition> extends true ? IsNotEmpty<Any, typeof done> extends true ? true :
                                                         false :
        false

type IsRestFunction<Any> =
        IsNotEmpty<Any, typeof hasSuffix> extends true ? IsNotEmpty<Any, typeof isSingular> extends true ? true :
                                                         false :
        false;


type IsNotEmpty<Any, Key> =
        symbol extends keyof Any ? false :
        Key extends keyof Any ? true :
        false

type Get<Any, Key> =
        symbol extends keyof Any ? never :
        Key extends keyof Any ? Any[Key] :
        never


import * as c from '../../../../core/coreTraits';

import * as b from './baseTupleTraits';


import environment from '../../../../../../../../environments/active';

// TODO: test defaults
// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    type RestFunctionExample =
            {
                [isSingular]: boolean
                [hasSuffix]: bigint
            };
    // noinspection JSUnusedLocalSymbols
    const isRestFunctionTestTrue: c.IsExactly<IsRestFunction<RestFunctionExample>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isRestFunctionTestFalse: c.IsExactly<IsRestFunction<1>, false> = true;

    // noinspection JSUnusedLocalSymbols
    const callRestFunctionTestEmpty: c.IsExactly<CallRestFunction<RestFunctionExample, [string]>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const callRestFunctionTestFull:
            c.IsExactly<CallRestFunction<RestFunctionExample, [string, number]>,
                    bigint> = true;


    // noinspection JSUnusedLocalSymbols
    type RecursiveFunctionExample =
            {
                [condition]: true
                [recurse]: number
                [done]: string
            };
    // noinspection JSUnusedLocalSymbols
    const isRecursiveFunctionTestTrue: c.IsExactly<IsRecursiveFunction<RecursiveFunctionExample>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isRecursiveFunctionTestFalse: c.IsExactly<IsRecursiveFunction<1>, false> = true;

    // noinspection JSUnusedLocalSymbols
    const callRecursiveFunctionTestTrue: c.IsExactly<CallRecursiveFunction<RecursiveFunctionExample>, number> = true;

    type RestBasic<T> = T extends [any, ...infer Rest] ? Rest : never;
    type HeadBasic<T> = 0 extends keyof T ? T[0] : never;
    // noinspection JSUnusedLocalSymbols
    type ToUnionRecursive<T> =
            T extends any ?
            Call<{
                [condition]: c.Not<b.IsEmpty<RestBasic<T>>>
                [recurse]: HeadBasic<T> | ToUnionRecursive<RestBasic<T>>
                [done]: HeadBasic<T>
            }, T> :
            never;
    // noinspection JSUnusedLocalSymbols
    const callRecursiveFunctionTest: c.IsExactly<ToUnionRecursive<[string, number]>, string | number> = true;
    // noinspection JSUnusedLocalSymbols
    const callRecursiveFunctionTestDone: c.IsExactly<ToUnionRecursive<[string]>, string> = true;
    // noinspection JSUnusedLocalSymbols
    const callRecursiveFunctionTestEmpty: c.IsExactly<ToUnionRecursive<b.EmptyT>, never> = true;


    // noinspection JSUnusedLocalSymbols
    const isSizedFunctionTestRest: c.IsExactly<IsSizedFunction<RestFunction>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isSizedFunctionTestRercursive: c.IsExactly<IsSizedFunction<RecursiveFunction>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isSizedFunctionTestFalse: c.IsExactly<IsSizedFunction<1>, false> = true;

    // noinspection JSUnusedLocalSymbols
    const callSizedFunctionTestRest:
            c.IsExactly<CallSizedFunction<RestFunctionExample, [string]>,
                    boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const callSizedFunctionTestRecursive:
            c.IsExactly<CallSizedFunction<RecursiveFunctionExample, [string]>,
                    number> = true;
    // noinspection JSUnusedLocalSymbols
    const callSizedFunctionTestRecurse:
            c.IsExactly<CallSizedFunction<RecursiveFunctionExample, [string]>,
                    number> = true;


    // noinspection JSUnusedLocalSymbols
    const isFunctionTestTrue: c.IsExactly<IsFunction<Function>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isFunctionTestFalse: c.IsExactly<IsFunction<1>, false> = true;

    // noinspection JSUnusedLocalSymbols
    type ToUnion<T> =
            c.True<c.Requires<T, b.T>> extends true ?
            T extends any ?

            Call<{
                [isEmpty]: b.ValueOf<T>,
                [isMaybeInfinite]: b.ValueOf<T>,
                [isFinitelyIterable]: ToUnionRecursive<T>
            }, T> :

            never :
            c.Requires<T, b.T>
    // noinspection JSUnusedLocalSymbols
    const callFunctionTestEmpty: c.IsExactly<ToUnion<b.EmptyTuple<number>>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const callFunctionTestEmptyTupl: c.IsExactly<ToUnion<b.EmptyT>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const callFunctionTestLengthless: c.IsExactly<ToUnion<number[]>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const callFunctionTestRecursive: c.IsExactly<ToUnion<[number, string]>, number | string> = true;
}
