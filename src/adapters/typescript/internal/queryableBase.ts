import { ElementType } from '../traits/iterableTraits';

export interface QueryableBase<Element> extends Iterable<Element>
{
    amQueryable(): true;

    toArray(): Element[];


    takeIf(condition: (item: Element) => boolean): QueryableBase<Element>;

    takeIfIs<New extends Element>(isNew: (item: Element) => item is New): QueryableBase<New>;


    map<NewElement>(
            transform: (item: Element, index?: number, iterable?: Iterable<Element>) => NewElement):
            QueryableBase<NewElement>;

    forEach(action: (item: Element, index?: number, iterable?: Iterable<Element>) => any): void;


    firstOrNull(condition: (item: Element) => boolean): null | Element;

    atOrNull(index: number): null | Element;

    slice(start: number, end: number): QueryableBase<Element>;


    reduce<Accumulator>(
            init: Accumulator,
            reducer: (accumulator: Accumulator, current: Element) => Accumulator): Accumulator;

    reduceMutable<Accumulator>(
            init: Accumulator,
            reducer: (accumulator: Accumulator, current: Element) => void): Accumulator;


    flatten(): QueryableBase<ElementType<Element>>;

    reverse(): QueryableBase<Element>;
}
