// noinspection JSUnusedGlobalSymbols
import { Try } from './core/core/conditionalTraits';


// noinspection JSClassNamingConvention, JSUnusedGlobalSymbols
type I = Iterable<unknown>
// noinspection JSUnusedGlobalSymbols
export type Iterabl = I

// noinspection JSClassNamingConvention, JSUnusedGlobalSymbols
type A = Array<unknown>
// noinspection JSUnusedGlobalSymbols
export type Arry = A

// noinspection JSUnusedGlobalSymbols
export type ArrayObject<Element> = { [Key in number]: Element }
// noinspection JSClassNamingConvention, JSUnusedGlobalSymbols
type AO = { [Key in number]: unknown }
// noinspection JSUnusedGlobalSymbols
export type ArrayObj = AO

// noinspection JSUnusedGlobalSymbols
export type ProperIterable<Element> = Iterable<Element> | Element[]
// noinspection JSClassNamingConvention, JSUnusedGlobalSymbols
type P = ProperIterable<unknown>;
// noinspection JSUnusedGlobalSymbols
export type ProperItearbl = P;

// noinspection JSUnusedGlobalSymbols
export type QuasiIterable<Element> =
        ProperIterable<Element> |
        ArrayObject<Element> |
        (string extends Element ? string : never);
// noinspection JSClassNamingConvention, JSUnusedGlobalSymbols
type Q = QuasiIterable<unknown>
// noinspection JSUnusedGlobalSymbols
export type QuasiItearbl = P;


// noinspection JSUnusedGlobalSymbols
export function isIterable(any: any): any is I
{
    return (any as I)[Symbol.iterator] !== undefined;
}


// noinspection JSUnusedGlobalSymbols
export function isArray(any: any): any is A
{
    return (any as []).findIndex !== undefined;
}


// noinspection JSUnusedGlobalSymbols
export function isArrayObject(any: any): any is AO
{
    return (any as ArrayObj).hasOwnProperty !== undefined;
}

// noinspection JSUnusedGlobalSymbols
export function toArray<Element>(ao: ArrayObject<Element>): Element[]
{
    // Intersection would use my trusty typed map library here, but this is lower level, so, no can do.
    const entries = Object.entries(ao) as [unknown, Element][] as [number, Element][];
    const result = [];

    for (const entry of entries) result[entry[0]] = entry[1];

    return result;
}


// noinspection JSUnusedGlobalSymbols
export function isString(any: any): any is string
{
    return (any as string).toLocaleLowerCase !== undefined;
}

// noinspection JSUnusedGlobalSymbols
export function toIterable(string: string): Iterable<string>
{
    return string;
}


// noinspection JSUnusedGlobalSymbols
export type IsProperIterable<Test> = Test extends P ? Test extends string ? never : Test : never
// noinspection JSUnusedGlobalSymbols
export type IsNotProperIterable<Test> = Test extends P ? never : Test extends string ? never : Test

// noinspection JSUnusedGlobalSymbols
export function isProperIterable(any: any): any is P
{
    return isIterable(any);
}


// noinspection JSUnusedGlobalSymbols
export type IsQuasiIterable<Test> = Test extends Q ? Test : never
// noinspection JSUnusedGlobalSymbols
export type IsNotQuasiIterable<Test> = Test extends Q ? never : Test

// noinspection JSUnusedGlobalSymbols
export function isQuasiIterable(any: any): any is Q
{
    return isIterable(any) || isArrayObject(any);
}

// noinspection JSUnusedGlobalSymbols
export function toProperIterable<Element>(quasi: QuasiIterable<Element>): ProperIterable<Element> | undefined
{
    if (!isString(quasi))
    {
        if (isIterable(quasi)) return quasi;
        return toArray<Element>(quasi);
    }
    return;
}


// noinspection JSUnusedGlobalSymbols
export type ElementType<Any> = Any extends QuasiIterable<infer Element> ? Element : never;
// noinspection JSUnusedGlobalSymbols
export type IsPossibleElementType<Any> = Any extends string ? string : (Any extends Q ? never : Any);

// noinspection JSClassNamingConvention
type ExtractPossibleElementTypes<Any> = IsPossibleElementType<Any>;

type ExtractQuasiIterables<Any> = Extract<Any, Q>


type DeepIterableStartingAt<Any> = Any | Iterable<DeepIterableStartingAt<Any>>;

type ToIterableDeepForAny<Any> =
        Any extends Q ?
        Any extends string ? Any : Iterable<ToIterableDeepForAny<ElementType<Any>>> :
        Any;
type ToIterableDeep<Iterable extends Q> = ToIterableDeepForAny<Iterable>;

// noinspection JSUnusedGlobalSymbols
export type DeepIterable<Any> =
        Any extends Q ?
        Any extends string ? string : ToIterableDeep<Any> :
        ExtractQuasiIterables<DeepIterableStartingAt<Any>>;

// noinspection JSUnusedGlobalSymbols
export type DeepIterableElementType<Any> =
        Any extends DeepIterableStartingAt<infer Element> ?
        ExtractPossibleElementTypes<Element> :
        never;


type DeepArrayStartingAt<Element> = Element | DeepArrayStartingAt<Element>[]

type ToArrayDeepForAny<Any> =
        Any extends Q ?
        Any extends string ? string : ToArrayDeepForAny<ElementType<Any>>[] :
        Any;
type ToArrayDeep<DeepIterable extends Q> = ToArrayDeepForAny<DeepIterable>

// noinspection JSUnusedGlobalSymbols
export type DeepArray<Any> =
        Any extends Q ?
        ToArrayDeep<Any> :
        ExtractQuasiIterables<DeepArrayStartingAt<Any>>;

// noinspection JSUnusedGlobalSymbols
export type DeepArrayElementType<Any> =
        Any extends DeepArrayStartingAt<infer Element> ?
        ExtractPossibleElementTypes<Element> :
        never;


type DeepArrayObjectForAny<Any> =
        {
            [Key in number]: Any | DeepArrayObjectForAny<Any>
        }

type ToArrayObjectDeepForAny<Any> =
        Any extends Q ?
        Any extends string ? string :
        { [Key in number]: ToArrayObjectDeepForAny<ElementType<Any>> } :
        Any;
type ToArrayObjectDeep<Iterable extends Q> = ToArrayDeepForAny<Iterable>

// noinspection JSUnusedGlobalSymbols
export type DeepArrayObject<Any> =
        Any extends Q ?
        ToArrayObjectDeep<Any> :
        ExtractQuasiIterables<DeepArrayObjectForAny<Any>>;

// noinspection JSUnusedGlobalSymbols
export type DeepArrayObjectElementType<Any> =
        Any extends DeepArrayObjectForAny<infer Element> ?
        ExtractPossibleElementTypes<Element> :
        never;


type TryIterableElementTypeDeep<Any> =
        Try<DeepIterableElementType<Any>, DeepIterableElementType<DeepIterable<Any>>>;

type TryArrayElementTypeDeep<Any> =
        Try<DeepArrayElementType<Any>, DeepArrayElementType<DeepArray<Any>>>;

type TryArrayObjectElementTypeDeep<Any> =
        Try<DeepArrayObjectElementType<Any>, DeepArrayObjectElementType<DeepIterable<Any>>>;

// TODO: fix output being dependent on order of try's
// noinspection JSUnusedLocalSymbols
type ElementTypeDeep<Any> =
        Try<Try<TryIterableElementTypeDeep<Any>,
                TryArrayElementTypeDeep<Any>>,
                TryArrayObjectElementTypeDeep<Any>>;
