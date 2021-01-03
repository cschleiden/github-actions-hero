import * as chevrotain from "chevrotain";
/**
 * Expressions cannot use arbitrary variables, everything needs to be access via a context,
 * so define all supported ones.
 * see https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#contexts
 */
export declare const Context: chevrotain.TokenType;
export declare const Dot: chevrotain.TokenType;
export declare const ContextMember: chevrotain.TokenType;
export declare const Operator: chevrotain.TokenType;
export declare const And: chevrotain.TokenType;
export declare const Or: chevrotain.TokenType;
export declare const Eq: chevrotain.TokenType;
export declare const NEq: chevrotain.TokenType;
export declare const LT: chevrotain.TokenType;
export declare const LTE: chevrotain.TokenType;
export declare const GT: chevrotain.TokenType;
export declare const GTE: chevrotain.TokenType;
export declare const Not: chevrotain.TokenType;
export declare const Function: chevrotain.TokenType;
export declare const contains: chevrotain.TokenType;
export declare const startsWith: chevrotain.TokenType;
export declare const endsWith: chevrotain.TokenType;
export declare const join: chevrotain.TokenType;
export declare const toJson: chevrotain.TokenType;
export declare const StringLiteral: chevrotain.TokenType;
export declare const NumberLiteral: chevrotain.TokenType;
export declare const WhiteSpace: chevrotain.TokenType;
declare const ExpressionLexer: chevrotain.Lexer;
declare class ExpressionParser extends chevrotain.CstParser {
    constructor();
    expression: (idxInCallingRule?: number, ...args: any[]) => chevrotain.CstNode;
    subExpression: (idxInCallingRule?: number, ...args: any[]) => chevrotain.CstNode;
    contextAccess: (idxInCallingRule?: number, ...args: any[]) => chevrotain.CstNode;
    contextMember: (idxInCallingRule?: number, ...args: any[]) => chevrotain.CstNode;
    contextDotMember: (idxInCallingRule?: number, ...args: any[]) => chevrotain.CstNode;
    contextBoxMember: (idxInCallingRule?: number, ...args: any[]) => chevrotain.CstNode;
    array: (idxInCallingRule?: number, ...args: any[]) => chevrotain.CstNode;
    logicalGrouping: (idxInCallingRule?: number, ...args: any[]) => chevrotain.CstNode;
    functionCall: (idxInCallingRule?: number, ...args: any[]) => chevrotain.CstNode;
    value: (idxInCallingRule?: number, ...args: any[]) => chevrotain.CstNode;
    booleanValue: (idxInCallingRule?: number, ...args: any[]) => chevrotain.CstNode;
}
export declare const defaultRule = "expression";
export declare const parser: ExpressionParser;
export declare const BaseCstVisitor: new (...args: any[]) => chevrotain.ICstVisitor<any, any>;
export { ExpressionLexer };
