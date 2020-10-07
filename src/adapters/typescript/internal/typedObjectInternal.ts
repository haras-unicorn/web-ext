export import o = TypedObjectInternal;

export default o;


import { All, SetUnionKeys, ToIndex, ToKey, HasToString } from '../traits/objectTraits';
import { ToUnion } from '../traits/core/composite/tupleTraits';

namespace TypedObjectInternal
{
    // noinspection JSUnusedGlobalSymbols
    export function isObject(test: any): test is object
    {
        return Boolean(test) &&
               Boolean(test['hasOwnProperty']);
    }


    // noinspection JSUnusedGlobalSymbols
    export function toKey<T extends HasToString>(keyValue: T): ToKey<T>
    {
        const type = typeof keyValue;
        if (type === 'string' || type === 'number' || type === 'symbol')
        {
            return keyValue as ToKey<T>;
        }

        return keyValue.toString() as ToKey<T>;
    }

    // noinspection JSUnusedGlobalSymbols
    export function toIndex<T extends HasToString>(indexValue: T): ToIndex<T>
    {
        const type = typeof indexValue;
        if (type === 'string' || type === 'number')
        {
            return indexValue as ToIndex<T>;
        }

        return indexValue.toString() as ToIndex<T>;
    }


    // noinspection JSUnusedGlobalSymbols
    export function fromIterable<Keys extends keyof any, Values extends any[keyof any]>(
            entries: Iterable<[Keys, Values]>): { [Key in Keys]: Values }
    {
        let result: { [Key in Keys]?: Values } = {};
        for (const entry of entries)
        {
            result[entry[0]] = entry[1];
        }

        return result as { [Key in Keys]: Values };
    }

    // noinspection JSUnusedGlobalSymbols
    export function from<Keys extends keyof any, Values extends any[keyof any]>(
            ...entries: [Keys, Values][]): { [Key in Keys]: Values }
    {
        return fromIterable(entries);
    }


    // noinspection JSUnusedGlobalSymbols
    export function* keys<Object extends object>(object: Object): Iterable<keyof Object>
    {
        for (const key in object) if (object.hasOwnProperty(key)) yield key;
    }

    // noinspection JSUnusedGlobalSymbols
    export function* values<Object extends object>(object: Object): Iterable<Object[keyof Object]>
    {
        for (const key of keys(object)) yield object[key];
    }

    // noinspection JSUnusedGlobalSymbols
    export function* entries<Object extends object>(
            object: Object): Iterable<[keyof Object, Object[keyof Object]]>
    {
        for (const key of keys(object)) yield [key, object[key]];
    }


    // noinspection JSUnusedGlobalSymbols
    export function pick<Object extends object, Keys extends keyof Object>(
            object: Object, ...keys: Keys[]): Pick<Object, Keys>
    {
        let result: Partial<Object> = {};
        for (const key of keys) result[key] = object[key];
        return result as Pick<Object, Keys>;
    }

    // noinspection JSUnusedGlobalSymbols
    export function omit<Object extends object, Keys extends keyof Object>(
            object: Object, ...keys: Keys[]): Omit<Object, Keys>
    {
        let result: Partial<Object> = {...object};
        for (const key of keys) delete result[key];
        return result as Omit<Object, Keys>;
    }


    // noinspection JSUnusedGlobalSymbols
    export function createBinaryTypeGuard<ObjectA extends object, ObjectB extends object>(
            ...exclusiveKeys: (Exclude<keyof ObjectA, keyof ObjectB>)[]):
            (toDetermine: ObjectA | ObjectB) => toDetermine is ObjectA
    {
        return (toDetermine: ObjectA | ObjectB): toDetermine is ObjectA =>
        {
            for (const key in exclusiveKeys)
                if (toDetermine.hasOwnProperty(key))
                    return true;

            return false;
        };
    }

    // noinspection JSUnusedGlobalSymbols
    export function createMultaryTypeGuard<Object extends object, Other extends object[]>(
            ...exclusiveKeys: (Exclude<keyof Object, Keys<Other>>)[]):
            (toDetermine: Object | ToUnion<Other>) => toDetermine is Object
    {
        return (toDetermine: Object | ToUnion<Other>): toDetermine is Object =>
        {
            for (const key in exclusiveKeys)
                if (toDetermine.hasOwnProperty(key))
                    return true;

            return false;
        };
    }

    // noinspection JSUnusedGlobalSymbols
    export function createUnaryTypeGuard<Object extends object>(
            ...exclusiveKeys: (keyof Object)[]):
            (toDetermine: object) => toDetermine is Object
    {
        return (toDetermine: object): toDetermine is Object =>
        {
            for (const key in exclusiveKeys)
                if (toDetermine.hasOwnProperty(key))
                    return true;

            return false;
        };
    }

    // noinspection JSUnusedGlobalSymbols
    export function add<Objects extends any[]>(...objects: Objects): All<Objects>
    {
        let result = {} as any;
        for (const object of objects)
            for (const [key, value] of entries(object))
                result[key] = value;

        return result as All<Objects>;
    }
}
