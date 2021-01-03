import { ILexingError, IRecognitionException } from "chevrotain";
import { IExpressionContext, RuntimeContexts } from "./evaluator";
export type { IExpressionContext, RuntimeContexts };
export declare class ExpressionError extends Error {
    lexErrors: ILexingError[];
    parseErrors: IRecognitionException[];
    constructor(lexErrors: ILexingError[], parseErrors: IRecognitionException[]);
}
export declare function parseExpression(expression: string): import("chevrotain").CstNode;
/**
 * Evaluates a single expression with the given context
 *
 * @param expression Expression to evaluate, with or without ${{ }} marker
 * @param context Context for evaluation
 */
export declare function evaluateExpression(expression: string, context: IExpressionContext): any;
/**
 * Evaluates and replaces zero or more expressions in a string. Expressions must be surrounded with
 * ${{ <expr> }} and will be replaced with their evaluation result in the returned string.
 *
 * @param input String containing zero or more expression
 * @param context Context for evaluation
 */
export declare function replaceExpressions(input: string, context: IExpressionContext): string;
