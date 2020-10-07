// noinspection JSUnusedGlobalSymbols
export type Sized<Any, Length, NoRecursive = never> =
        c.True<c.Requires<Length, number>> extends true ?

        c.Is<Any, b.T> extends true ? SizedInternal<b.ValueOf<Any>, Length, NoRecursive> :
        SizedInternal<Any, Length, NoRecursive> :

        c.Requires<Length, number>;


type SizedRecrusive<Element, Length, CurrentTuple = b.EmptyT> =
        {
            recurse: SizedRecrusive<Element, Length, [...c.Cast<CurrentTuple, b.T>, Element]>,
            done: CurrentTuple
        } [ b.Size<CurrentTuple> extends Length ? 'done' : 'recurse' ]

type SizedNoRecursive<Element, Length> = [Element, ...Element[]] & { length: Length }

type SizedInternal<Element, Length, NoRecursive> =
        Length extends 0 ? b.EmptyTuple<Element> :
        number extends Length ? b.Tuple<Element> :
        c.IsNever<NoRecursive> extends true ? SizedRecrusive<Element, Length> :
        SizedNoRecursive<Element, Length>


import * as c from '../../../../core/coreTraits';

import * as b from './baseTupleTraits';


import environment from '../../../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const sizedTest: Sized<number, 3> = [1, 2, 3];
    // noinspection JSUnusedLocalSymbols
    const sizedTestUnion: Sized<number | undefined, 3> = [1, undefined, 3];
    // noinspection JSUnusedLocalSymbols
    const sizedTestEmpty: Sized<number, 0> = [] as b.EmptyT;
    // noinspection JSUnusedLocalSymbols
    const sizedTestTuple: Sized<[number], 3> = [1, 2, 3];
    // noinspection JSUnusedLocalSymbols
    const sizedTestResizePartial: Sized<[number?, string?], 3> = [1, 'a', undefined];
    // noinspection JSUnusedLocalSymbols
    const sizedTestResizeEmpty: Sized<[number], 0> = [] as b.EmptyTuple<number>;
    // noinspection JSUnusedLocalSymbols
    const sizedTestNever: Sized<never, 3> = [] as never;
    // noinspection JSUnusedLocalSymbols
    const sizedTestNeverTuple: Sized<never[], 0> = [] as b.EmptyTuple<never>;
}
