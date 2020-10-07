// noinspection JSUnusedGlobalSymbols
export type Pair<First, Second> =
        c.Not<c.IsRequired<First>> extends true ? c.Not<c.IsRequired<Second>> extends true ?
                                                  [c.ToRequired<First>?, c.ToRequired<Second>?] :
                                                  [Second] | [First, Second] :
        c.Not<c.IsRequired<Second>> extends true ? [First, c.ToRequired<Second>?] :
        [First, Second];


import * as c from '../../../../core/coreTraits';


import environment from '../../../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const pairTestAny: c.IsExactly<Pair<any, any>, [any, any]> = true;
    // noinspection JSUnusedLocalSymbols
    const pairTestPartialFirst:
            c.IsExactly<Pair<number | undefined, string>,
                    [string] | [number | undefined, string]> = true;
    // noinspection JSUnusedLocalSymbols
    const pairTestPartialSecond:
            c.IsExactly<Pair<number, string | undefined>,
                    [number, string?]> = true;
    // noinspection JSUnusedLocalSymbols
    const pairTestPartialBoth:
            c.IsExactly<Pair<number | undefined, string | undefined>,
                    [number?, string?]> = true;
}
