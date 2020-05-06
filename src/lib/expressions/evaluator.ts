import { tokenMatcher } from "chevrotain";
import * as Functions from "./functions";
import {
  And,
  BaseCstVisitor,
  contains,
  endsWith,
  Eq,
  GT,
  GTE,
  join,
  LT,
  LTE,
  NEq,
  Or,
  startsWith,
} from "./parser";

export interface IExpressionContext {
  contexts: { [contextName: string]: { [id: string]: {} } };
}

class ExpressionEvaluator extends BaseCstVisitor {
  expression(ctx: any, context: IExpressionContext) {
    let result = this.visit(ctx.lhs, context);

    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        let rhsResult = this.visit(rhsOperand, context);
        const operator = ctx.Operator[idx];

        // Coerce types
        if (typeof result != typeof rhsResult) {
          result = this._coerceValue(result);
          rhsResult = this._coerceValue(rhsResult);
        }

        switch (true) {
          // ==
          case tokenMatcher(operator, Eq):
            result = result == rhsResult;
            break;

          // !=
          case tokenMatcher(operator, NEq):
            result = result != rhsResult;
            break;

          // &&
          case tokenMatcher(operator, And):
            result = result && rhsResult;
            break;

          // ||
          case tokenMatcher(operator, Or):
            result = result || rhsResult;
            break;

          // <
          case tokenMatcher(operator, LT):
            result = result < rhsResult;
            break;

          // <=
          case tokenMatcher(operator, LTE):
            result = result <= rhsResult;
            break;

          // >
          case tokenMatcher(operator, GT):
            result = result > rhsResult;
            break;

          // >=
          case tokenMatcher(operator, GTE):
            result = result >= rhsResult;
            break;
        }
      });
    }

    return result;
  }

  subExpression(ctx: any, context: IExpressionContext) {
    switch (true) {
      case !!ctx.value:
        return this.visit(ctx.value, context);

      case !!ctx.logicalGrouping:
        return this.visit(ctx.logicalGrouping, context);

      case !!ctx.array:
        return this.visit(ctx.array, context);

      case !!ctx.functionCall:
        return this.visit(ctx.functionCall, context);

      case !!ctx.contextAccess:
        return this.visit(ctx.contextAccess, context);
    }
  }

  contextAccess(ctx: any, context: IExpressionContext) {
    const contextObject = context.contexts[ctx.Context[0].image];

    const result = (ctx.contextMember as any[]).reduce(
      (previousResult, contextMember) =>
        this.visit(contextMember, previousResult),
      contextObject
    );
    return result;
  }

  contextMember(ctx: any, contextObject: any) {
    switch (true) {
      case !!ctx.contextDotMember:
        return this.visit(ctx.contextDotMember, contextObject);

      case !!ctx.contextBoxMember:
        return this.visit(ctx.contextBoxMember, contextObject);
    }
  }

  contextDotMember(ctx: any, contextObject: any) {
    const path = ctx.ContextMember[0].image;
    return contextObject[path];
  }

  contextBoxMember(ctx: any, contextObject: any) {
    const path = this._removeQuotes(ctx.StringLiteral[0].image);
    return contextObject[path];
  }

  logicalGrouping(ctx: any) {
    return this.visit(ctx.expression);
  }

  array(ctx: any) {
    const result = [];

    if (ctx.subExpression) {
      result.push(...ctx.subExpression.map((se) => this.visit(se)));
    }

    return result;
  }

  functionCall(ctx: any) {
    const parameters = ctx.expression.map((p) => this.visit(p));

    const f = ctx.Function[0];
    switch (true) {
      case !!tokenMatcher(f, contains):
        return Functions.contains(parameters[0], parameters[1]);

      case !!tokenMatcher(f, startsWith):
        return Functions.startsWith(parameters[0], parameters[1]);

      case !!tokenMatcher(f, endsWith):
        return Functions.endsWith(parameters[0], parameters[1]);

      case !!tokenMatcher(f, join):
        return Functions.join(parameters[0], parameters[1]);
    }
  }

  value(ctx: any) {
    switch (true) {
      case !!ctx.NumberLiteral:
        return parseFloat(ctx.NumberLiteral[0].image);

      case !!ctx.booleanValue:
        return this.visit(ctx.booleanValue);

      case !!ctx.Null:
        return null;

      case !!ctx.StringLiteral: {
        const value: string = ctx.StringLiteral[0].image;
        return this._removeQuotes(value);
      }
    }
  }

  booleanValue(ctx: any) {
    let result: boolean;

    switch (true) {
      case !!ctx.True:
        result = true;
        break;

      case !!ctx.False:
        result = false;
        break;
    }

    if (!!ctx.Not) {
      result = !result;
    }

    return result;
  }

  private _coerceValue(val: any): any {
    if (typeof val === "number") {
      return val;
    }

    if (typeof val === "string") {
      if (val === "") {
        return 0;
      }

      return +val;
    }

    if (val === null) {
      return 0;
    }

    if (val === true) {
      return 1;
    }

    if (val === false) {
      return 0;
    }

    return NaN;
  }

  private _removeQuotes(value: string): string {
    return "" + value.substring(1, value.length - 1).replace(/''/g, "'");
  }
}

export const evaluator = new ExpressionEvaluator();
