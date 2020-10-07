import { IsIterable } from '../traits/iterableTraits';
import { QueryableBase } from './queryableBase';


// TODO: CRTP here requires higher kinded types so... yeah

abstract class BuilderBase
{
    abstract create<Element, CreateReturn extends QueryableBase<Element>>(...iterables: Iterable<Element>[]): CreateReturn
}

// noinspection JSUnusedGlobalSymbols
export abstract class QueryableInternal<Element, Builder extends BuilderBase>
{
    private readonly _builder: Builder;


    private readonly _inner: Iterable<Element>;

    [Symbol.iterator](): Iterator<Element>
    {
        return this._inner[Symbol.iterator]();
    }


    protected constructor(
            builder: Builder,
            ...iterable: Iterable<Element>[])
    {
        this._builder = builder;
        this._inner =
                (
                        function* (): Iterable<Element>
                        {
                            for (const queryable of iterable)
                                for (const element of queryable)
                                    yield element;
                        }
                )();
    }


    amQueryable(): true { return true; }

    toArray(): Element[]
    {
        return [...this];
    }


    takeIf(
            this: QueryableBase<Element, Builder>,
            condition: (item: Element) => boolean)
    {
        return this._builder.create(
                (
                        function* (this: QueryableBase<Element, Builder>): Iterable<Element>
                        {
                            for (const item of this) if (condition(item)) yield item;
                        }
                ).bind(this)()
        );
    };

    takeIfIs<New extends Element>(
            this: QueryableBase<Element, Builder>,
            isNew: (item: Element) => item is New)
    {
        return this._builder.create(
                (
                        function* (this: QueryableBase<Element, Builder>)
                        {
                            for (const item of this) if (isNew(item)) yield item;
                        }
                ).bind(this)()
        );
    };

    map<NewElement>(
            this: QueryableBase<Element, Builder>,
            transform: (item: Element, index?: number, iterable?: Iterable<Element>) => NewElement)
    {
        return this._builder.create(
                (
                        function* (this: QueryableBase<Element, Builder>)
                        {
                            let index = 0;
                            for (const item of this)
                            {
                                yield transform(item, index, this._inner);
                                index++;
                            }
                        }
                ).bind(this)()
        );
    };

    forEach(
            this: QueryableBase<Element, Builder>,
            action: (item: Element, index?: number, iterable?: Iterable<Element>) => any)
    {
        let index = 0;
        for (const item of this)
        {
            action(item, index, this._inner);
            index++;
        }
    };

    firstOrNull(
            this: QueryableBase<Element, Builder>,
            condition: (item: Element) => boolean)
    {
        for (const item of this) if (condition(item)) return item;
        return null;
    };

    atOrNull(this: QueryableBase<Element, Builder>, index: number)
    {
        let current = 0;
        for (const item of this)
        {
            if (index === current) return item;
            current++;
        }

        return null;
    };

    slice(this: QueryableBase<Element, Builder>, start: number, end: number)
    {
        return this._builder.create(
                (
                        function* (this: QueryableBase<Element, Builder>): Iterable<Element>
                        {
                            let current = 0;
                            for (const item of this)
                            {
                                if (current >= start && current < end) yield item;
                                current++;
                            }
                        }
                ).bind(this)()
        );
    };

    reduce<Accumulator>(
            this: QueryableBase<Element, Builder>,
            init: Accumulator,
            reducer: (accumulator: Accumulator, current: Element) => Accumulator)
    {
        let result: Accumulator = init;
        for (const element of this)
        {
            result = reducer(result, element);
        }
        return result;
    }

    reduceMutable<Accumulator>(
            init: Accumulator,
            reducer: (accumulator: Accumulator, current: Element) => void)
    {
        let result: Accumulator = init;
        for (const element of this)
        {
            reducer(result, element);
        }
        return result;
    }

    flatten(this: QueryableBase<IsIterable<Element>, Builder>)
    {
        return this._builder.create(
                (
                        function* (this: QueryableBase<IsIterable<Element>, Builder>)
                        {
                            for (const iterable of this)
                                for (const element of iterable)
                                    yield element;
                        }
                ).bind(this)()
        );
    }

    reverse()
    {
        const array = this.toArray();
        return this._builder.create(
                (
                        function* ()
                        {
                            for (let index = array.length - 1; index >= 0; index--) yield array[index];
                        }
                )()
        );
    }
}

class QueryableInternalFastBuilder implements BuilderBase
{
    create<Element, CreateReturn extends QueryableInternal<Element, any>>(
            ...iterables: Iterable<Element>[]): CreateReturn
    {
        return new QueryableInternalFast(...iterables) as CreateReturn;
    }
}

class QueryableInternalFast<Element> extends QueryableInternal<Element, QueryableInternalFastBuilder>
{
    public constructor(...iterables: Iterable<Element>[])
    {
        super(new QueryableInternalFastBuilder(), ...iterables);
    }
}

// noinspection JSUnusedGlobalSymbols
const q = <Element>(...iterables: Iterable<Element>[]) => new QueryableInternalFast(...iterables);

q([[1, 2]]).flatten();

// noinspection JSUnusedGlobalSymbols
export default q;
