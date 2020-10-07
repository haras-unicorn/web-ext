import { useWindowListener } from './useEventListener';

/*
 * I implemented this because the useEffect hook doesn't trigger the componentWillUnmount event
 * on refresh which makes it impossible to store app state properly.
 */

function useLoadPair(onLoad: (...any: any[]) => any, onUnload: (...any: any[]) => any)
{
    useWindowListener('load', onLoad);
    useWindowListener('unload', onUnload);
}

export default useLoadPair;
