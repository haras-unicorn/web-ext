import React from 'react';

export type ReactElementWithSameProps<Component extends keyof JSX.IntrinsicElements |
                                                        React.JSXElementConstructor<any>> =
        React.ReactElement<React.ComponentProps<Component>>
