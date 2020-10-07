// noinspection JSUnusedLocalSymbols, JSClassNamingConvention
type N = number | bigint;


// noinspection JSUnusedGlobalSymbols
export type Num = N;

// noinspection JSUnusedGlobalSymbols, MagicNumberJS
export type Zero = 0 | 0n;

// noinspection JSUnusedGlobalSymbols
export function isZero(any: any): any is Zero
{
    // noinspection EqualityComparisonWithCoercionJS
    return any == 0;
}

// noinspection JSUnusedGlobalSymbols, MagicNumberJS
export type One = 1 | 1n;

// noinspection JSUnusedGlobalSymbols
export function isOne(any: any): any is One
{
    // noinspection EqualityComparisonWithCoercionJS
    return any == 1;
}

// noinspection JSUnusedGlobalSymbols, MagicNumberJS
export type Two = 2 | 2n;

// noinspection JSUnusedGlobalSymbols
export function isTwo(any: any): any is Two
{
    // noinspection EqualityComparisonWithCoercionJS
    return any == 2;
}

// noinspection JSUnusedGlobalSymbols, MagicNumberJS
export type Three = 3 | 3n;

// noinspection JSUnusedGlobalSymbols
export function isThree(any: any): any is Three
{
    // noinspection EqualityComparisonWithCoercionJS
    return any == 3;
}


// noinspection JSUnusedLocalSymbols
type Get<Tuple extends any[], Number extends number> = Tuple[Number]

// https://github.com/microsoft/TypeScript/issues/31461
type IsNegativeInternal<Number> =
        Number extends number ?

        Number extends 0 ? boolean :
        number extends Number ? boolean :

        e.IsRequired<Get<[], Number>> extends true ? true : false :

        never;

// noinspection JSUnusedGlobalSymbols
export type IsNegative<Number> =
        c.Requires<Number, number> extends true ?
        Number extends any ?

        IsNegativeInternal<Number> :

        never :
        c.Requires<Number, number>;

// noinspection JSUnusedGlobalSymbols
export type IsPositive<Number> =
        c.Requires<Number, number> extends true ?
        Number extends any ?

        c.Not<IsNegativeInternal<Number>> :

        never :
        c.Requires<Number, number>;


import * as c from '../../core/conditionalTraits';
import * as e from '../../core/existentialTraits';

import environment from '../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols, MagicNumberJS
    const isNegativeCheckPositive: c.IsExactly<e.IsRequired<Get<[], 0.1>>, false> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS
    const isNegativeCheckNegative: c.IsExactly<e.IsRequired<Get<[], -0.1>>, true> = true;

    // noinspection JSUnusedLocalSymbols
    const isNegativeTestNumber: c.IsExactly<IsNegative<number>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const isNegativeTestNegative: c.IsExactly<IsNegative<-1>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isNegativeTestNegativeTen: c.IsExactly<IsNegative<-10>, true> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS
    const isNegativeTestNegativeDecimal: c.IsExactly<IsNegative<-10.1>, true> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS
    const isNegativeTestNegativeSmall: c.IsExactly<IsNegative<-0.1>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isNegativeTestZero: c.IsExactly<IsNegative<0>, boolean> = true;
    // noinspection JSUnusedLocalSymbols
    const isNegativeTestPositive: c.IsExactly<IsNegative<1>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isNegativeTestPositiveTen: c.IsExactly<IsNegative<10>, false> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS
    const isNegativeTestPositiveDecimal: c.IsExactly<IsNegative<10.1>, false> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS
    const isNegativeTestPositiveSmall: c.IsExactly<IsNegative<0.1>, false> = true;
}
