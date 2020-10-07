// noinspection JSUnusedGlobalSymbols
import * as u from './core/composite/core/unionTraits';
import * as e from './core/core/existentialTraits';
import * as p from './core/primitive/core/basePrimitiveTraits';
import * as t from './core/composite/tuple/tupleTraits';

// noinspection JSClassNamingConvention
type O = object;
// noinspection JSUnusedGlobalSymbols
export type Obj = O
// noinspection JSClassNamingConvention
type NO = e.NonExistent | p.Primitive;
// noinspection JSUnusedGlobalSymbols
export type NonObject = NO;

// noinspection JSUnusedGlobalSymbols
export function isObject(any: any): any is O
{
    return (any as O).hasOwnProperty !== undefined;
}

// noinspection JSUnusedGlobalSymbols
export function isNonObject(any: any): any is NO
{
    return !isObject(any);
}


// noinspection JSUnusedGlobalSymbols
export type HasHasOwnProperty = { hasOwnProperty(key: keyof any): boolean }

// noinspection JSUnusedGlobalSymbols
export type HasToString = { toString(): string };
// noinspection JSUnusedGlobalSymbols
export type ToToStringResult<Any> = Any extends HasToString ? string : never;


// noinspection JSUnusedGlobalSymbols
export type Key = PropertyKey;
// noinspection JSUnusedGlobalSymbols
export type Index = string | number;

// noinspection JSUnusedGlobalSymbols
export type ToObject<Any> = Any extends object ? object : never;
// noinspection JSUnusedGlobalSymbols
export type ToKey<Any> = Any extends Key ? Any : ToToStringResult<Any>;
// noinspection JSUnusedGlobalSymbols
export type ToIndex<Any> = Any extends Index ? Any : ToToStringResult<Any>;

// noinspection JSUnusedGlobalSymbols
export type IsIn<Key, Object> = Key extends keyof Object ? Key : never;
// noinspection JSUnusedGlobalSymbols
export type IsNotIn<Key, Object> = Key extends keyof Object ? never : Key;

type PathInternal<Object, CurrentTuple extends t.T = []> =
        Extract<keyof Object, Index> extends never ?
        { _path: CurrentTuple } :
        { [Key in keyof Object]: PathInternal<Object[Key], [...CurrentTuple, Key]> } &
        { _path: CurrentTuple }

export type Path<Object> = PathInternal<Object>

export type Pat = { [K in Key]?: Pat | any } & { _path?: any[] }

export type ExtractType<O, T extends t.NonEmptyT> = {
    [K in keyof O]:
    ((...a: T) => any) extends ((a: any, ...args: infer Tail) => any)
    ? Tail['length'] extends 0 ? O[K] : ExtractType<O[K], Tail> : never
}[T[0]]

// example Foo is number
const a: ExtractType<{ a: { b: { c: { d: number } } }, g: string }, ['a', 'b', 'c', 'd']> = 1;

// noinspection JSUnusedGlobalSymbols
export type ObjectWith<Keys extends PropertyKey = PropertyKey, Values = any> = { [Key in Keys]: Values };

// noinspection JSUnusedGlobalSymbols
export type PartialWith<Keys extends PropertyKey = PropertyKey, Values = any> = { [Key in Keys]?: Values };
// noinspection JSUnusedGlobalSymbols
export type SomePartial<Object, Keys extends keyof Object> = Omit<Object, Keys> & { [Key in Keys]?: Object[Key] }

// noinspection JSUnusedGlobalSymbols
export type RequiredWith<Keys extends PropertyKey = PropertyKey, Values = any> = { [Key in Keys]-?: Values };
// noinspection JSUnusedGlobalSymbols
export type SomeRequired<Object, Keys extends keyof Object> = Omit<Object, Keys> & { [Key in Keys]-?: Object[Key] }

// noinspection JSUnusedGlobalSymbols
export type MutableWith<Keys extends PropertyKey = PropertyKey, Values = any> = { -readonly [Key in Keys]: Values };
// noinspection JSUnusedGlobalSymbols
export type Mutable<Object> = { -readonly [Key in keyof Object]: Object[Key] }
// noinspection JSUnusedGlobalSymbols
export type SomeMutable<Object, Keys extends keyof Object> =
        Omit<Object, Keys> & { -readonly [Key in Keys]: Object[Key] }

// noinspection JSUnusedGlobalSymbols
export type ReadonlyWith<Keys extends PropertyKey = PropertyKey, Values = any> = { readonly [Key in Keys]: Values };
// noinspection JSUnusedGlobalSymbols
export type SomeReadonly<Object, Keys extends keyof Object> =
        Omit<Object, Keys> & { readonly [Key in Keys]: Object[Key] }


type SetUnionKeys<Tuple extends t.T> = Tuple extends PartialWith<infer AllKeys>[] ? AllKeys : never;
type SetUnionValues<Tuple extends t.T> = Tuple extends PartialWith<Key, infer AllValues>[] ? AllValues : never;

type PickFromAny<Tuple extends t.T, Key extends keyof t.ToIntersection<Tuple>> =
        Tuple extends (RequiredWith<Key, infer ValuesOnSome> |
                       PartialWith<SetUnionKeys<Tuple>, SetUnionValues<Tuple>>)[] ?
        ValuesOnSome :
        never;


// noinspection JSUnusedGlobalSymbols
export type SetIntersection<Tuple extends t.T> = { [Key in Extract<keyof A, keyof B>]: A[Key] | B[Key] }
// noinspection JSUnusedGlobalSymbols
export type SetUnion<Tuple extends t.T> = { [Key in keyof t.ToIntersection<Tuple>]: PickFromAny<Tuple, Key> }

type AllCallSignatures<Tuple extends t.T> = u.ToIntersection<Exclude<t.ToUnion<Tuple>, SetUnion<Tuple>>>;

// Intersection but repeating keys have value type of the last repeating key.
// Keeps all call signatures.
// noinspection JSUnusedGlobalSymbols
export type All<Tuple extends t.T> = SetUnion<Tuple> & AllCallSignatures<Tuple>;


type NonObjectKeysInternal<Object, Keys> = Keys extends keyof Object ?
                                           Object[Keys] extends object ? never : Keys :
                                           never;
export type NonObjectKeys<Object> = NonObjectKeysInternal<Object, Exclude<keyof Object, Exclude<keyof [], number>>>;
type PickNonObjects<Object> = Pick<Object, NonObjectKeys<Object>>

type ObjectKeysInternal<Object, Keys> = Keys extends keyof Object ?
                                        Object[Keys] extends object ? Keys : never :
                                        never;
export type ObjectKeys<Object> = ObjectKeysInternal<Object, Exclude<keyof Object, Exclude<keyof [], number>>>
// TODO: add recursion https://github.com/microsoft/TypeScript/pull/33050
type PickObjectsInternal<Object, Keys> =
        Keys extends keyof Object ?
        Object[Keys] extends object ? Object[Keys] : never :
        never;
type PickObjects<Object> = u.ToIntersection<PickObjectsInternal<Object, ObjectKeys<Object>>>;

// noinspection JSUnusedGlobalSymbols
export type Flatten<Object> =
        Object extends object ?
        All<[PickNonObjects<Object>, PickObjects<Object>]> :
        Object;
