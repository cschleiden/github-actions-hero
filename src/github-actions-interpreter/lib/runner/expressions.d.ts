import { IExpressionContext } from "../expressions/evaluator";
import { EnvMap } from "../workflow";
/** Evaluate a single `if` expression */
export declare function _evIf(input: string | undefined, ctx: IExpressionContext): boolean | undefined;
/** Evaluate a generic expression */
export declare function _ev(input: string | undefined, ctx: IExpressionContext): string | undefined;
export declare function _evMap(env: EnvMap, ctx: IExpressionContext): EnvMap;
