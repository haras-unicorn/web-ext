import { Curried, Func } from '../traits/functionTraits';
import { Head, Length, Rest } from '../traits/core/composite/tupleTraits';
import { Arry } from '../traits/iterableTraits';
import { If, IsExactly } from '../traits/core/core/conditionalTraits';

namespace FunctionalInternal
{
    // noinspection JSUnusedGlobalSymbols
    export function head<Function extends Func>(f: Function, ...rest: Rest<Parameters<Function>>):
            (rest: Head<Parameters<Function>>) => ReturnType<Function>
    {
        return head => f(head, ...rest);
    }

    // noinspection JSUnusedGlobalSymbols
    export function rest<Function extends Func>(f: Function, head: Head<Parameters<Function>>):
            <RestParameters extends Partial<Rest<Parameters<Function>>>>(
                    ...rest: RestParameters & Arry) =>
                    If<IsExactly<Length<Readonly<RestParameters>>, Length<Parameters<Function>>>, ReturnType<Function>>, >
    {
        return <RestParameters extends Partial<Rest<Parameters<Function>>>>(...rest: RestParameters & Arry) =>
        {
            return f(head, ...rest);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    export function curry<Function extends Func>(f: Function): Curried<Function>
    {
        if (Object.keys(f.arguments) === []) return (arg => f(arg)) as Curried<Function>;
        return (arg => curry(rest(f, arg))) as Curried<Function>;
    }
}

const a = FunctionalInternal.curry((a, b, c) => 1);

a(1)(2)(3);

const c: Readonly<[a?: 1, b: 2]> = [1, 2];
