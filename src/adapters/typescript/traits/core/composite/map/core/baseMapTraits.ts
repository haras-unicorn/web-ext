// noinspection JSUnusedGlobalSymbols
export type Map<Keys, Values> = e.Compute<MapInternal<Keys, Values>>
// noinspection JSUnusedGlobalSymbols, JSClassNamingConvention
export type M = e.Compute<Map<any, any>>

// noinspection JSUnusedGlobalSymbols
export type HasHasOwnProperty = { hasOwnProperty(key: keyof any): boolean }

// noinspection JSUnusedGlobalSymbols
export function isMap(any: any): any is M
{
    return (any as M).hasOwnProperty !== undefined;
}


// noinspection JSUnusedGlobalSymbols
export type Key = keyof any;
// noinspection JSUnusedGlobalSymbols
export type Index = string | number;

// noinspection JSUnusedGlobalSymbols
export type KeyOf<Any> =
        c.True<c.Requires<Any, M>> extends true ?
        Any extends any ?

        e.Cast<KeyOfInternal<Any>, keyof Any> :

        never :
        c.Requires<Any, M>;

// noinspection JSUnusedGlobalSymbols
export type ValueOf<Any> =
        c.True<c.Requires<Any, M>> extends true ?
        Any extends any ?

        Any[e.Cast<KeyOfInternal<Any>, keyof Any>] :

        never :
        c.Requires<Any, M>;

// noinspection JSUnusedGlobalSymbols
export type Has<Any, Key> =
        c.True<c.Requires<Any, M>> extends true ?
        Any extends any ?

        HasInternal<Any, Key> :

        never :
        c.Requires<Any, M>;

// noinspection JSUnusedGlobalSymbols
export type HasToString = { toString(): string };
// noinspection JSUnusedGlobalSymbols
export type ToToStringResult<Any> =
        c.True<c.Requires<Any, HasToString>> extends true ?
        Any extends any ?

        string :

        never :
        c.Requires<Any, HasToString>;

// noinspection JSUnusedGlobalSymbols
export type ToKey<Any> = c.Is<Any, Key> extends true ? Any : ToToStringResult<Any>;
// noinspection JSUnusedGlobalSymbols
export type IsPossibleKey<Any> = c.Or<c.Is<Any, Key>, c.Is<Any, HasToString>>


// noinspection JSUnusedGlobalSymbols
export type EmtpyMap<Keys> = Map<Keys, never>
// noinspection JSUnusedGlobalSymbols
export type EmtpyM = EmtpyMap<never>

// noinspection JSUnusedGlobalSymbols
export type Size<Any> =
        c.True<c.Requires<Any, M>> extends true ?
        Any extends any ?

        SizeInternal<Any> :

        never :
        c.Requires<Any, M>;

// noinspection JSUnusedGlobalSymbols
export type IsEmpty<Any> =
        c.True<c.Requires<Any, M>> extends true ?
        Any extends any ?

        IsEmptyInternal<Any> :

        never :
        c.Requires<Any, M>;

// noinspection JSUnusedGlobalSymbols
export type IsSizeless<Any> =
        c.True<c.Requires<Any, M>> extends true ?
        Any extends any ?

        IsSizelessInternal<Any> :

        never :
        c.Requires<Any, M>;


type MapInternal<Keys, Values> =
        e.IsAny<Keys> extends true ? Record<keyof any, Values> :
        e.IsUnknown<Keys> extends true ? Record<keyof any, Values> :
        e.IsNever<Keys> extends true ? Record<keyof any, never> :
        Record<Extract<Keys, keyof any>, Values>;


type KeyOfInternal<Map> =
        Exclude<keyof Map, (Map extends ((...args: any[]) => any) ? keyof ((...args: any[]) => any) : never) |

                           (Map extends any[] ? Exclude<keyof any[], number extends Map['length'] ? number : never> :
                            never) |

                           (Map extends object ? keyof object : never)> |
        (Map extends any[] ? number extends Map['length'] ? number : never : never);

type HasInternal<Map, Key> = u.Has<KeyOfInternal<Map>, Key>


type IsEmptyInternal<Map> = e.IsNever<Map[e.Cast<KeyOfInternal<Map>, keyof Map>]>;

type IsSizelessInternal<Map> =
        IsEmptyInternal<Map> extends true ? false :
        c.Strictly<c.Or<HasInternal<Map, string>, c.Or<HasInternal<Map, number>, HasInternal<Map, symbol>>>>

type SizeInternal<Map> =
        IsSizelessInternal<Map> extends true ? number :
        u.Length<KeyOfInternal<Map>>


import * as e from '../../../core/existentialTraits';
import * as c from '../../../core/conditionalTraits';
import * as u from '../../core/unionTraits';

import environment from '../../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const keyOfTestObject: c.IsExactly<KeyOf<{ a: 1, b: 2 }>, 'a' | 'b'> = true;
    // noinspection JSUnusedLocalSymbols
    const keyOfTestArray: c.IsExactly<KeyOf<[any]>, '0'> = true;
    // noinspection JSUnusedLocalSymbols
    const keyOfTestArraySizeless: c.IsExactly<KeyOf<any[]>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const keyOfTestFunction: c.IsExactly<KeyOf<() => void>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const keyOfTestMixed: c.IsExactly<KeyOf<(() => void) & { a: string }>, 'a'> = true;
    // noinspection JSUnusedLocalSymbols
    const keyOfTestEmpty: c.IsExactly<KeyOf<{}>, never> = true;


    // noinspection JSUnusedLocalSymbols
    const emptyMapTest: EmtpyM = {};
    // @ts-ignore
    // noinspection JSUnusedLocalSymbols
    const emptyMapTestNonEmpty: EmtpyM = {a: 1};

    // noinspection JSUnusedLocalSymbols
    const isSizelessTestEmptyMap: c.IsExactly<IsSizeless<EmtpyM>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isSizelessTestEmptyObject: c.IsExactly<IsSizeless<{}>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isSizelessTestArray: c.IsExactly<IsSizeless<number[]>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isSizelessTestTuple: c.IsExactly<IsSizeless<[any]>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isSizelessTestObject: c.IsExactly<IsSizeless<{ a: 1 }>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isSizelessTestMap: c.IsExactly<IsSizeless<Map<string, number>>, true> = true;

    // noinspection JSUnusedLocalSymbols
    const sizeTestAny: c.IsExactly<Size<any>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const sizeTestUnknown: c.IsExactly<Size<unknown>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const sizeTestNever: c.IsExactly<Size<never>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const sizeTestNull: c.IsExactly<Size<null>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const sizeTestNumber: c.IsExactly<Size<number>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const sizeTestObject: c.IsExactly<Size<{ a: 3 }>, 1> = true;
    // noinspection JSUnusedLocalSymbols
    const sizeTestUnion: c.IsExactly<Size<{ a: 3 } | {}>, 1 | 0> = true;
    // noinspection JSUnusedLocalSymbols
    const sizeTestIntersection: c.IsExactly<Size<{ a: 3 } & {}>, 1> = true;
    // noinspection JSUnusedLocalSymbols
    const sizeTestSizeless: c.IsExactly<Size<any[]>, number> = true;
    // noinspection JSUnusedLocalSymbols
    const sizeTestTuple: c.IsExactly<Size<[any]>, 1> = true;

    // noinspection JSUnusedLocalSymbols
    const isEmptyTestObject: c.IsExactly<IsEmpty<{ a: 1 }>, false> = true;
    // noinspection JSUnusedLocalSymbols
    const isEmptyTestEmptyObject: c.IsExactly<IsEmpty<{}>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isEmptyTestEmptyMap: c.IsExactly<IsEmpty<EmtpyM>, true> = true;
    // noinspection JSUnusedLocalSymbols
    const isEmptyTestEmptyArray: c.IsExactly<IsEmpty<[]>, true> = true;


    // noinspection JSUnusedLocalSymbols
    const toToStringResultUnknown: c.IsExactly<ToToStringResult<unknown>, unknown> = true;
    // noinspection JSUnusedLocalSymbols
    const toToStringResultNumber: c.IsExactly<ToToStringResult<number>, string> = true;
    // noinspection JSUnusedLocalSymbols
    const toToStringResultNull: c.IsExactly<ToToStringResult<null>, never> = true;
    // noinspection JSUnusedLocalSymbols
    const toToStringResultBoolean: c.IsExactly<ToToStringResult<boolean>, string> = true;

}
