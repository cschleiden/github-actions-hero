import { BaseCstVisitor } from "./parser";
export interface RuntimeContexts {
    github: any;
    env?: any;
    job?: any;
    steps?: any;
    runner?: any;
    secrets?: {
        [key: string]: string;
    };
    strategy?: any;
    matrix?: any;
    needs?: any;
}
export interface IExpressionContext {
    contexts: RuntimeContexts;
}
/**
 * This evaluates an expression by operation on the CST produced by the parser.
 */
declare class ExpressionEvaluator extends BaseCstVisitor {
    expression(ctx: any, context: IExpressionContext): any;
    subExpression(ctx: any, context: IExpressionContext): any;
    contextAccess(ctx: any, context: IExpressionContext): any;
    contextMember(ctx: any, contextObject: any): any;
    contextDotMember(ctx: any, contextObject: any): any;
    contextBoxMember(ctx: any, contextObject: any): any;
    logicalGrouping(ctx: any): any;
    array(ctx: any): any[];
    functionCall(ctx: any, context: IExpressionContext): string | boolean;
    value(ctx: any): any;
    booleanValue(ctx: any): boolean;
    private _coerceValue;
    private _removeQuotes;
}
export declare const evaluator: ExpressionEvaluator;
export {};
