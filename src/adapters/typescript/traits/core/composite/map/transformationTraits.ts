// noinspection JSUnusedGlobalSymbols
export type ToTuple<Any, Keys = b.KeyOf<Any>> =
        c.True<c.Requires<Any, b.M>> extends true ?
        Any extends any ?

        ToTupleInternal<Any, Keys> :

        never :
        c.Requires<Any, b.M>;

// noinspection JSUnusedGlobalSymbols
export type ToOptional<Any, Keys = b.KeyOf<Any>> = To<'optional', Any, Keys>;
// noinspection JSUnusedGlobalSymbols
export type ToRequired<Any, Keys = b.KeyOf<Any>> = To<'required', Any, Keys>;
// noinspection JSUnusedGlobalSymbols
export type ToReadonly<Any, Keys = b.KeyOf<Any>> = To<'readonly', Any, Keys>;
// noinspection JSUnusedGlobalSymbols
export type ToMutable<Any, Keys = b.KeyOf<Any>> = To<'mutable', Any, Keys>;


// noinspection JSUnusedGlobalSymbols
export type Neutral = 'required' | 'mutable';
// noinspection JSUnusedGlobalSymbols
export type Existence = 'required' | 'optional';
// noinspection JSUnusedGlobalSymbols
export type Checked = 'optional' | 'readonly';
// noinspection JSUnusedGlobalSymbols
export type Accessibility = 'readonly' | 'mutable';
// noinspection JSUnusedGlobalSymbols
export type Modifier = Checked | Neutral;

// noinspection JSUnusedGlobalSymbols, JSClassNamingConvention
export type To<Mod, Any, Keys = b.KeyOf<Any>> =
        c.True<c.Requires<Mod, Modifier, 'union'>> extends true ?
        c.True<c.Requires<Any, b.M>> extends true ?
        Any extends any ?

        ToInternal<ComputeModifier<Mod>, Any, Keys> :

        never :
        c.Requires<Any, b.M> :
        c.Requires<Mod, Modifier, 'union'>;


type ToTupleInternal<Map, Keys, CurrentTuple = [], CurrentKey = u.OneOf<b.KeyOf<Map>>> =
        {
            recurse:
                    ToTupleInternal<Omit<Map, e.Cast<CurrentKey, keyof Map>>,
                            Keys,
                            CurrentKey extends Keys ?
                            [...e.Cast<CurrentTuple, any[]>, [CurrentKey, Map[e.Cast<CurrentKey, keyof Map>]]] :
                            CurrentTuple>

            done: CurrentTuple

        } [e.IsNever<CurrentKey> extends true ? 'done' : 'recurse'];


type ToOptionalInternal<Any, Keys extends keyof Any> =
        {
            [Key in Keys]?: Exclude<Any[Key], undefined>
        }
type ToRequiredInternal<Any, Keys extends keyof Any> =
        {
            [Key in Keys]-?: Exclude<Any[Key], undefined>
        }
type ToReadonlyInternal<Any, Keys extends keyof Any> =
        {
            readonly [Key in Keys]: Any[Key]
        }
type ToMutableInternal<Any, Keys extends keyof Any> =
        {
            -readonly [Key in Keys]: Any[Key]
        }


// noinspection JSUnusedGlobalSymbols
type ComputeModifier<Mod> =
        Existence extends Extract<Mod, Existence> ? Accessibility extends Extract<Mod, Accessibility> ? never :
                                                    Extract<Mod, Accessibility> :
        Accessibility extends Extract<Mod, Accessibility> ? Extract<Mod, Existence> :
        Extract<Mod, Modifier>

type ToInternal<Mod, Any, Keys> =
        {
            recurse:
                    Omit<Any, e.Cast<Keys, keyof Any>> &
                    (
                            u.OneOf<Mod> extends 'optional' ?
                            To<Exclude<Mod, 'optional'>, ToOptionalInternal<Any, Extract<Keys, keyof Any>>, Keys> :

                            u.OneOf<Mod> extends 'required' ?
                            To<Exclude<Mod, 'required'>, ToRequiredInternal<Any, Extract<Keys, keyof Any>>, Keys> :

                            u.OneOf<Mod> extends 'readonly' ?
                            To<Exclude<Mod, 'readonly'>, ToReadonlyInternal<Any, Extract<Keys, keyof Any>>, Keys> :

                            u.OneOf<Mod> extends 'mutable' ?
                            To<Exclude<Mod, 'mutable'>, ToMutableInternal<Any, Extract<Keys, keyof Any>>, Keys> :

                            never
                            )

            done: Any

        } [e.IsNever<Mod> extends true ? 'done' : 'recurse']


import * as c from '../../core/conditionalTraits';
import * as e from '../../core/existentialTraits';
import * as b from './core/baseMapTraits';
import * as u from '../core/unionTraits';

import environment from '../../../../../../environments/active';

// TESTS
if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const toTupleTestMap: c.IsExactly<ToTuple<{ a: string }>, [['a', string]]> = true;
    // noinspection JSUnusedLocalSymbols
    const toTupleTestSizeless: c.IsExactly<ToTuple<{ [Key in string]: string }>, [[string, string]]> = true;
    // noinspection JSUnusedLocalSymbols
    const toTupleTestMixed:
            c.IsExactly<ToTuple<{ [Key in number]: string } & { a: number }>,
                    [[number, string], ['a', number]]> = true;

    // noinspection JSUnusedLocalSymbols
    const toPartialTestMap: c.IsExactly<ToOptional<{ readonly a: 1 }>, { readonly a?: 1 }> = true;
    // noinspection JSUnusedLocalSymbols
    const toPartialTestKeys: c.IsExactly<ToOptional<{ readonly a: 1, b: 2 }, 'a'>, { readonly a?: 1, b: 2 }> = true;

    // noinspection JSUnusedLocalSymbols
    const toRequiredlTestMap: c.IsExactly<ToRequired<{ readonly a?: 1 }>, { readonly a: 1 }> = true;
    // noinspection JSUnusedLocalSymbols
    const toRequiredlTestKeys: c.IsExactly<ToRequired<{ readonly a?: 1, b?: 2 }, 'a'>, { readonly a: 1, b?: 2 }> = true;

    // noinspection JSUnusedLocalSymbols
    const toReadonlylTestMap: c.IsExactly<ToReadonly<{ a?: 1 }>, { readonly a?: 1 }> = true;
    // noinspection JSUnusedLocalSymbols
    const toReadonlylTestKeys: c.IsExactly<ToReadonly<{ a?: 1, b: 2 }, 'a'>, { readonly a?: 1, b: 2 }> = true;

    // noinspection JSUnusedLocalSymbols
    const toMutablelTestMap: c.IsExactly<ToMutable<{ readonly a?: 1 }>, { a?: 1 }> = true;
    // noinspection JSUnusedLocalSymbols
    const toMutablelTestKeys:
            c.IsExactly<ToMutable<{ readonly a?: 1, readonly b: 2 }, 'a'>, { a?: 1, readonly b: 2 }> = true;


    // noinspection JSUnusedLocalSymbols
    const toMixedlTestMap: c.IsExactly<To<Neutral, { readonly a?: 1 }>, { a: 1 }> = true;
    // noinspection JSUnusedLocalSymbols
    const toMixedlTestKeys:
            c.IsExactly<To<'readonly' | 'optional', { a?: 1, readonly b: 2 }, 'a'>,
                    { readonly a?: 1, readonly b: 2 }> = true;
}
