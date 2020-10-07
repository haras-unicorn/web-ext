import { MutableRefObject, useEffect, useRef } from 'react';

// Stolen from: https://usehooks.com/
type EventName<Target extends EventTarget> = Parameters<Target['addEventListener']>[0];
// TODO: generic support
type EventListenerOf<Target extends EventTarget, Name extends EventName<Target>> =
        Exclude<Parameters<Target['addEventListener']>[1], null>;

function isListenerObject(eventListener: EventListenerOrEventListenerObject): eventListener is EventListenerObject
{
    return (eventListener as EventListenerObject).handleEvent !== undefined;
}

function isListener(eventListener: EventListenerOrEventListenerObject): eventListener is EventListener
{
    return (eventListener as EventListener)[Symbol.hasInstance] !== undefined;
}

function getEventListener(listenerOrObject: EventListenerOrEventListenerObject): EventListener
{
    if (isListenerObject(listenerOrObject))
    {
        return listenerOrObject.handleEvent;
    }
    if (isListener(listenerOrObject))
    {
        return listenerOrObject;
    }

    throw new Error('never');
}

// noinspection JSUnusedGlobalSymbols
export function useEventListener<Target extends EventTarget,
        Name extends EventName<Target>,
        Listener extends EventListenerOf<Target, Name>>(
        target: Target,
        name: Name,
        listener: Listener): void
{
    let savedHandler: MutableRefObject<EventListener> = useRef(getEventListener(listener));

    useEffect(
            () =>
            {
                savedHandler.current = getEventListener(listener);
            },
            [listener]);

    useEffect(
            () =>
            {
                const eventListener = (event: Event) => savedHandler.current(event);
                target.addEventListener(name, eventListener);

                return () =>
                {
                    target.removeEventListener(name, eventListener);
                };
            },
            [name, target]);
}

// noinspection JSUnusedGlobalSymbols
export function useWindowListener<Name extends EventName<Window>>(
        name: Name,
        listener: EventListenerOf<Window, Name>)
{
    useEventListener(window, name, listener);
}

// noinspection JSUnusedGlobalSymbols
export function useDocumentListener<Name extends EventName<Document>>(
        name: Name,
        listener: EventListenerOf<Document, Name>)
{
    useEventListener(document, name, listener);
}

export default useEventListener;
