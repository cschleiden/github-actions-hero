import { evaluateExpression, replaceExpressions } from "../expressions";
import { IExpressionContext } from "../expressions/evaluator";
import { EnvMap } from "../workflow";

/** Evaluate a single `if` expression */
export function _evIf(
  input: string | undefined,
  ctx: IExpressionContext
): boolean | undefined {
  if (!input) {
    return undefined;
  }

  return !!evaluateExpression(input, ctx);
}

/** Evaluate a generic expression */
export function _ev(
  input: string | undefined,
  ctx: IExpressionContext
): string | undefined {
  if (!input) {
    return input;
  }

  return replaceExpressions(input, ctx);
}

export function _evMap(env: EnvMap, ctx: IExpressionContext): EnvMap {
  return Object.keys(env || {}).reduce((t, key) => {
    t[key] =
      typeof env[key] === "string" ? _ev(env[key] as string, ctx) : env[key];
    return t;
  }, {});
}
