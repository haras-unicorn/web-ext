// noinspection JSUnusedLocalSymbols
type TraitFunctionUntypedCall =
        {
            '__never'?: any,
            '__any'?: any,
            '__unknown'?: any
        }
// noinspection JSUnusedLocalSymbols
type TraitFunctionNonExistentCall =
        {
            '__void'?: any,
            '__null'?: any,
            '__undefined'?: any
        }
// noinspection JSUnusedLocalSymbols
type TraitFunctionPrimitiveCall =
        {
            '__boolean'?: any,
            '__bigint'?: any,
            '__number'?: any,
            '__string'?: any
        }
// TODO
// noinspection JSUnusedLocalSymbols
type TraitFunctionTupleCall = {}
// TODO
// noinspection JSUnusedLocalSymbols
type TraitFunctionObjectCall = {}
// TODO
// noinspection JSUnusedLocalSymbols
type TraitFunctionMetaCall = {}

// noinspection JSUnusedLocalSymbols
type TraitFunctionCall =
        {
            '__function'?: any,
            '__untyped'?: any,
            '__nonExistent'?: any,
            '__primitive'?: any,
            '__tuple'?: any,
            '__object'?: any
        }

// noinspection JSUnusedGlobalSymbols
export type TraitFunction = { '__call': TraitFunctionCall }
// noinspection JSUnusedGlobalSymbols
export type IsTraitFunction<Any> =
        (any extends Any ? true : false) extends true ? boolean :
        unknown extends Any ? boolean :
        [Any] extends [never] ? false :
        Any extends TraitFunction ? true : false;


// noinspection JSUnusedLocalSymbols
type CallNever<TraitFunct extends TraitFunction> =
        TraitFunct['__call']['__untyped'] extends TraitFunctionUntypedCall ?
        TraitFunct['__call']['__untyped']['__never'] :
        never;

// noinspection JSUnusedLocalSymbols
type CallAny<TraitFunct extends TraitFunction> =
        TraitFunct['__call']['__untyped'] extends TraitFunctionUntypedCall ?
        TraitFunct['__call']['__untyped']['__any'] :
        never;

// noinspection JSUnusedLocalSymbols
type CallUnknown<TraitFunct extends TraitFunction> =
        TraitFunct['__call']['__untyped'] extends TraitFunctionUntypedCall ?
        TraitFunct['__call']['__untyped']['__unknown'] :
        never;

// noinspection JSUnusedLocalSymbols
type CallUntyped<TraitFunct extends TraitFunction, Parameter> =
        TraitFunct['__call']['__untyped']

// noinspection JSUnusedLocalSymbols
type CallVoid<TraitFunct extends TraitFunction> =
        TraitFunct['__call']['__nonExistent'] extends TraitFunctionNonExistentCall ?
        TraitFunct['__call']['__nonExistent']['__void'] :
        never;

// noinspection JSUnusedLocalSymbols
type CallNull<TraitFunct extends TraitFunction> =
        TraitFunct['__call']['__nonExistent'] extends TraitFunctionNonExistentCall ?
        TraitFunct['__call']['__nonExistent']['__null'] :
        never;

// noinspection JSUnusedLocalSymbols
type CallUndefined<TraitFunct extends TraitFunction> =
        TraitFunct['__call']['__nonExistent'] extends TraitFunctionNonExistentCall ?
        TraitFunct['__call']['__nonExistent']['__undefined'] :
        never;

// noinspection JSUnusedLocalSymbols
type CallNonExistent<TraitFunct extends TraitFunction> = TraitFunct['__call']['__nonExistent']


// TESTS
import environment from '../../../../environments/active';

if (environment.isDevelopment)
{
    // noinspection JSUnusedLocalSymbols
    const isTraitFunctionTest: IsTraitFunction<TraitFunction> = true;
    // noinspection JSUnusedLocalSymbols
    const isTraitFunctionTestFunction: IsTraitFunction<object> = false;
    // noinspection JSUnusedLocalSymbols
    const isTraitFunctionTestFunctionCurly: IsTraitFunction<{}> = false;
    // noinspection JSUnusedLocalSymbols
    const isTraitFunctionTestNever: IsTraitFunction<never> = false;
    // noinspection JSUnusedLocalSymbols
    const isTraitFunctionTestAny: boolean extends IsTraitFunction<any> ? true : false = true;
    // noinspection JSUnusedLocalSymbols
    const isTraitFunctionTestUnknown: boolean extends IsTraitFunction<unknown> ? true : false = true;
}
