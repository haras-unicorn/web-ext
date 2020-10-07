export import f = FunctionTraits;

export default f;

export namespace Traits
{
    export import Function = FunctionTraits;
    export import f = Function;
}


export namespace FunctionTraits
{
    // noinspection JSClassNamingConvention, JSUnusedGlobalSymbols
    interface F {(...args: any): any}
    // noinspection JSUnusedGlobalSymbols
    export interface Func extends F {}
    export type IsFunction<Any> =
            (any extends Any ? true : false) extends true ? boolean :
            unknown extends Any ? boolean :
            [Any] extends [never] ? false :
            [Any] extends [F] ? true : false;

    // noinspection JSUnusedGlobalSymbols
    export function isFunction(any: any): any is F { return (any as F)[Symbol.hasInstance] !== undefined; }

    // noinspection JSUnusedGlobalSymbols
    export type Function<Parameters, Return> =
            c.t.IsTuple<Parameters> extends true ?
            Parameters extends c.t.Tupl ? (...args: Parameters) => Return : never :
            (arg: Parameters) => Return;



    // noinspection JSUnusedGlobalSymbols
    export type SwapReturnType<Funct extends F, NewReturnType> = Function<Parameters<Funct>, NewReturnType>;
    // noinspection JSUnusedGlobalSymbols
    export type SwapParameters<Funct extends F, NewParameters extends c.t.Tupl> = Function<NewParameters, ReturnType<Funct>>;


    type PartialRestParametersInternal<Head, Rest> =
           c.t.Length<Rest> extends 0 ?
            Head extends c.t.Tupl ? Head : [Head] :
            Head extends c.t.Tupl ? c.t.Concat<[Head, Rest]> : c.t.Concat<[[Head], Rest]>;
    type PartialRestParameters<Funct> =
            Funct extends F ?
            PartialRestParametersInternal<c.t.Head<Parameters<Funct>>, c.t.ToPartial<c.t.Rest<Parameters<Funct>>>> :
            never;
    // noinspection JSUnusedGlobalSymbols
    export type Head<Funct> =
            IsFunction<Funct> extends true ?
            Funct extends F ?
            c.c.If<c.c.Is<c.t.Length<Parameters<Funct>>, 0>,
                    Tail<Funct>,
                    c.c.If<c.c.Is<c.t.Length<Parameters<Funct>>, 1>,
                            Funct,
                            <Parameters extends PartialRestParameters<Funct>>(...args: Parameters) => ReturnType<Funct>>>
            : never :
            never;
    // noinspection JSUnusedGlobalSymbols
    export type Tail<Funct extends F> = SwapParameters<Funct, []>;
    // noinspection JSUnusedGlobalSymbols
    export type Rest<Funct extends F> = SwapParameters<Funct, c.t.Rest<Parameters<Funct>>>;


    // noinspection JSUnusedGlobalSymbols
    export type Curried<Funct extends F> =
            c.c.If<c.c.Is<c.t.Length<Parameters<Funct>>, 1>,
                    Head<Funct>,
                    c.c.If<c.c.Is<c.t.Length<Parameters<Funct>>, 0>,
                            Tail<Funct>,
                            <Params extends PartialRestParameters<Funct>>(...args: Params) =>
                                    c.c.If<c.c.Is<Params, Parameters<Funct>>,
                                            ReturnType<Funct>,
                                            Curried<Rest<Funct>>>>>;

    const curry: Curried<(a: number, b: string) => boolean> =
            <Params extends [a: number, b?: string]>(...args: Params):
                    c.c.If<c.c.Is<Params, [number, string]>,
                            boolean,
                            Curried<(b: string) => boolean>> =>
            {
                const paramsIsWhole =
                        (arg: [a: number, b?: string]): arg is [a: number, b: string] =>
                                args[1] !== undefined;

                if (paramsIsWhole(args)) return true;
                else return (b: string) => true;
            };

    const a = curry(1, 'a');
}


import c from './core/traitsCore';

import environment from '../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
}
