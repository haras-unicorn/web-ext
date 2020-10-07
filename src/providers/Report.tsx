import React from 'react';
import {
    LazyQueryResult as LazyQueryResultGeneric,
    MutationResult,
    OperationVariables,
    QueryResult
} from '@apollo/client';

import { IonText } from '@ionic/react';


// They could have put defaults in here but oh well...
// noinspection JSUnusedGlobalSymbols
type LazyQueryResult = LazyQueryResultGeneric<any, OperationVariables>;

// noinspection JSUnusedGlobalSymbols
export type ReportTypes =
        MutationResult |
        LazyQueryResult |
        QueryResult |
        boolean


// noinspection JSUnusedGlobalSymbols
export const isBoolean = (test: ReportTypes): test is boolean =>
        (test as Pick<MutationResult | QueryResult | LazyQueryResult, 'loading'>).loading === undefined;

// noinspection JSUnusedGlobalSymbols
export const isQueryResult = (test: ReportTypes): test is QueryResult | LazyQueryResult =>
        (test as Pick<QueryResult, Exclude<keyof QueryResult, keyof MutationResult>>).networkStatus !== undefined;

// noinspection JSUnusedGlobalSymbols
export const isEagerQueryResult = (test: ReportTypes): test is QueryResult =>
        (test as Pick<QueryResult, Exclude<keyof QueryResult, keyof MutationResult>>).networkStatus !== undefined &&
        (test as QueryResult).called;

// noinspection JSUnusedGlobalSymbols
export const isLazyQueryResult = (test: ReportTypes): test is LazyQueryResult =>
        (test as Pick<QueryResult, Exclude<keyof QueryResult, keyof MutationResult>>).networkStatus !== undefined &&
        !(test as LazyQueryResult).called;

// noinspection JSUnusedGlobalSymbols
export const isMutationResult = (test: ReportTypes): test is MutationResult =>
        (test as Pick<MutationResult | QueryResult | LazyQueryResult, 'loading'>).loading !== undefined &&
        (test as Pick<QueryResult, Exclude<keyof QueryResult, keyof MutationResult>>).networkStatus === undefined;


// noinspection JSUnusedGlobalSymbols
export const shouldReport = (...concat: ReportTypes[]): boolean =>
{
    for (const piece of concat)
    {
        if (isBoolean(piece))
        {
            return piece;
        }
        else
        {
            if (piece.called && (piece.loading || Boolean(piece.error))) return true;
        }
    }

    return false;
};


interface Props
{
    concat: ReportTypes[]

    children?:
            {
                loadingText?: React.ReactText,
                errorText?: React.ReactText,
                finalText?: React.ReactText,
                progressIndicator?: React.ReactNode
            }
}

const Report: React.FC<Props> = (props: Props) =>
{
    for (const piece of props.concat)
    {
        if (isBoolean(piece))
        {
            if (piece && props.children?.finalText) return (
                    <>
                        <br/>
                        <p className="ion-text-center">
                            {props.children?.finalText}
                        </p>
                        <br/>
                        {props.children?.progressIndicator}
                        <br/>
                    </>
            );
        }
        else
        {
            if (piece.loading && props.children?.loadingText) return (
                    <>
                        <br/>
                        <p className="ion-text-center">
                            {props.children?.loadingText}
                        </p>
                        <br/>
                        {props.children?.progressIndicator}
                        <br/>
                    </>
            );

            if (piece.error && props.children?.errorText) return (
                    <>
                        <br/>
                        <p className="ion-text-center">
                            {props.children?.errorText}
                        </p>
                        <br/>
                        <IonText color="danger">
                            <p>{piece.error.message}</p>
                        </IonText>
                        <br/>
                    </>
            );
        }
    }

    return null;
};


// noinspection JSUnusedGlobalSymbols
export default Report;
