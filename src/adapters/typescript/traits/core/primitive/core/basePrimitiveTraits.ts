// noinspection JSClassNamingConvention
type P = boolean | bigint | number | string | symbol;
// noinspection JSUnusedGlobalSymbols
export type Primitive = P;


type LiteralPrimitiveTypeInternal<Any> =
        Any extends boolean ? boolean :
        Any extends number ? number :
        Any extends bigint ? bigint :
        Any extends string ? string :
        Any extends symbol ? symbol :
        never;

// noinspection JSUnusedGlobalSymbols
export type LiteralPritiveType<Any> =
        c.Requires<Any, Primitive> extends true ?
        Any extends any ?

        LiteralPrimitiveTypeInternal<Any> :

        never :
        c.Requires<Any, Primitive>;

// noinspection JSUnusedGlobalSymbols
export type ExcludeLiteral<Any, Literal> =
        c.Requires<Literal, Primitive> extends true ?
        Literal extends any ?

        Any & Exclude<Any, Literal> :

        never :
        c.Requires<Literal, Primitive>;


import * as c from '../../core/conditionalTraits';

import environment from '../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const literalPrimitiveTypeTestAny: c.IsExactly<LiteralPritiveType<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const literalPrimitiveTypeTestUnknown: c.IsExactly<LiteralPritiveType<unknown>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const literalPrimitiveTypeTestNever: c.IsExactly<LiteralPritiveType<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const literalPrimitiveTypeTestNull: c.IsExactly<LiteralPritiveType<null>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const literalPrimitiveTypeTestMixed: c.IsExactly<LiteralPritiveType<null | 2>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const literalPrimitiveTypeTestUnion: c.IsExactly<LiteralPritiveType<number | 'a'>, number | string> = true;
    // noinspection JSUnusedLocalSymbols
    const literalPrimitiveTypeTestNumber: c.IsExactly<LiteralPritiveType<1.0>, number> = true;
    // noinspection JSUnusedLocalSymbols, MagicNumberJS
    const literalPrimitiveTypeTestBigint: c.IsExactly<LiteralPritiveType<1n>, bigint> = true;
    // noinspection JSUnusedLocalSymbols
    const literalPrimitiveTypeTestString: c.IsExactly<LiteralPritiveType<'a'>, string> = true;
    // noinspection JSUnusedLocalSymbols
    const literalPrimitiveTypeTestBoolean: c.IsExactly<LiteralPritiveType<true>, boolean> = true;
}
