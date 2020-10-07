// noinspection JSUnusedGlobalSymbols
export type Reverse<Any> =
        c.True<c.Requires<Any, b.T>> extends true ?
        Any extends any ?

        ReverseInternal<Any> :

        never :
        c.Requires<Any, b.T>


type ReverseInternal<Tuple> =
        f.Call<{
            [f.isEmpty]: Tuple
            [f.isMaybeInfinite]: Tuple
            [f.isFinitelyIterable]:
                    {
                        [f.hasSuffix]: s.SpreadBoth<ReverseInternal<a.Suffix<Tuple>>, o.HeadTuple<Tuple>>
                        [f.isSingular]: Tuple
                    }
        }, Tuple>;


import * as c from '../../../core/coreTraits';


import * as b from './core/baseTupleTraits';
import * as f from './core/tupleFunction';

import * as a from './accessFunctions';
import * as s from './spreadFunctions';
import * as o from './optionalTraits';


import environment from '../../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const reverseTestTuple: c.IsExactly<Reverse<[1, 2, 3]>, [3, 2, 1]> = true;
    // noinspection JSUnusedLocalSymbols
    const reverseTestPartial: c.IsExactly<Reverse<[1, 2, 3?]>, [2, 1] | [3 | undefined, 2, 1]> = true;
    // noinspection JSUnusedLocalSymbols
    const reverseTestFullyPartial: c.IsExactly<Reverse<[1?, 2?, 3?]>, [3?, 2?, 1?]> = true;
}
