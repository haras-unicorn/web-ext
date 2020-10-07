import { QueryableBase, QueryableInternal } from './internal/queryableInternal';

import o from './internal/typedObjectInternal';
import { IfObject } from './traits/objectTraits';


class Queryable<Element> extends QueryableInternal<Element, Queryable<Element>>
{
    pick<Keys extends keyof Element>(
            this: QueryableBase<ToObject<Element>>, ...keys: Keys[]): QueryableBase<Pick<Element, Keys>>
    {
        return new QueryableInternal(
                (
                        function* (_this: QueryableInternal<IfObject<Element>>): Iterable<Pick<Element, Keys>>
                        {
                            for (const item of _this) yield o.pick(item, ...keys);
                        }
                )(this)
        );
    };

    omit<Keys extends keyof Element>(
            this: QueryableBase<IfObject<Element>>, ...keys: Keys[]): QueryableBase<Omit<Element, Keys>>
    {
        return new QueryableInternal(
                (
                        function* (_this: QueryableInternal<IfObject<Element>>): Iterable<Omit<Element, Keys>>
                        {
                            for (const item of _this) yield o.omit(item, ...keys);
                        }
                )(this)
        );
    };
}


// noinspection JSUnusedGlobalSymbols
export type IsQueryable<Test> = Test extends Queryable<any> ? Test : never;

// noinspection JSUnusedGlobalSymbols
export const isQueryable = <Element>(any: any): any is Queryable<any> =>
        (any as Queryable<Element>)?.amQueryable();


// noinspection JSUnusedGlobalSymbols
const q = o.add(
        <Element>(iterable: Iterable<Element>) => new Queryable(iterable),
        o.omit(Queryable, 'prototype'));

// noinspection JSUnusedGlobalSymbols
export default q;
