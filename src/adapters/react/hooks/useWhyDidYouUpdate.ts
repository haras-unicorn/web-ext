import React from 'react';

import o from '../../typescript/typedObject';
import q from '../../typescript/queryable';


// Stolen and minimized from: https://usehooks.com/

// noinspection JSUnusedGlobalSymbols
function useWhyDidYouUpdate(name: string, props: any)
{
    const previousProps = React.useRef<any | undefined>();

    React.useEffect(
            () =>
            {
                if (previousProps.current)
                {
                    console.log(`[${name} update] start`);
                    q.concat(o.keys(previousProps.current), o.keys(props))
                     .takeIf(key => props[key] !== previousProps.current[key])
                     .forEach(keyOfChanged =>
                             console.log(`[${name} update] key: ${keyOfChanged.toString()} ` +
                                         `from: ${previousProps.current[keyOfChanged]} ` +
                                         `to: ${props[keyOfChanged]}`));
                }

                // Finally update previousProps with current props for next hook call
                previousProps.current = props;
            });
}

// noinspection JSUnusedGlobalSymbols
export default useWhyDidYouUpdate;
