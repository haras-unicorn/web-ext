// noinspection JSUnusedGlobalSymbols
export type First<Any, To> =
        c.True<c.Requires<Any, b.T>> extends true ?
        c.True<c.Requires<To, number>> extends true ?
        Any extends any ?
        To extends any ?

        c.IsExactly<To, number> extends true ? Any :
        p.IsNegative<To> extends true ? never :
        c.Not<c.IsGreaterOrEqual<To, b.IndexOf<Any>>> extends true ? Any :

        FirstInternal<Any, To> :

        never :
        never :
        c.Requires<To, number> :
        c.Requires<Any, b.T>

// noinspection JSUnusedGlobalSymbols
export type Last<Any, To> = r.Reverse<First<r.Reverse<Any>, To>>

type FirstInternal<Tuple, To> =
        f.Call<{
            [f.isEmpty]: Tuple,
            [f.isMaybeInfinite]: Tuple,
            [f.isFinitelyIterable]:
                    {
                        // TODO: optimize MaxSize
                        // @ts-ignore
                        [f.condition]: c.Not<c.IsExactly<b.MaxSize<Tuple>, To>>
                        [f.recurse]: FirstInternal<a.Prefix<Tuple>, To>
                        [f.done]: Tuple
                    }
        }, Tuple>


import * as c from '../../../core/coreTraits';

import * as p from '../../../primitive/primitiveTraits';


import * as b from './core/baseTupleTraits';
import * as f from './core/tupleFunction';

import * as a from './accessFunctions';
import * as r from './reverseFunction';


import environment from '../../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const firstTestShrink: c.IsExactly<First<[string, number], 1>, [string]> = true;
    // noinspection JSUnusedLocalSymbols
    const firstTestExcess: c.IsExactly<First<[string, number], 3>, [string, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const firstTestNegative: c.IsExactly<First<[string, number], -3>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const firstTestZero: c.IsExactly<First<[string, number], 0>, b.EmptyT> = true;
    // noinspection JSUnusedLocalSymbols
    const firstTestUnion:
            c.IsExactly<First<[string, number] | [number], 0 | 1>,
                    b.EmptyT | [string] | [number]> = true;
    // noinspection JSUnusedLocalSymbols
    const firstTestPartial: c.IsExactly<First<[string?, number?], 1>, [string?]> = true;

    // noinspection JSUnusedLocalSymbols
    const lastTestShrink: c.IsExactly<Last<[string, number], 1>, [number]> = true;
    // noinspection JSUnusedLocalSymbols
    const lastTestExcess: c.IsExactly<Last<[string, number], 3>, [string, number]> = true;
    // noinspection JSUnusedLocalSymbols
    const lastTestNegative: c.IsExactly<Last<[string, number], -3>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const lastTestZero: c.IsExactly<Last<[string, number], 0>, b.EmptyT> = true;
    // noinspection JSUnusedLocalSymbols
    const lastTestUnion: c.IsExactly<Last<[string, number] | [number], 0 | 1>, b.EmptyT | [number]> = true;
    // noinspection JSUnusedLocalSymbols
    const lastTestPartial: c.IsExactly<Last<[string?, number?], 1>, [number?]> = true;
    // TODO: fix never
    // noinspection JSUnusedLocalSymbols
    const lastTestBig:
            c.IsExactly<Last<[string, number, bigint, boolean, undefined, never], 4>,
                    [bigint, boolean, undefined, undefined]> = true;
}
