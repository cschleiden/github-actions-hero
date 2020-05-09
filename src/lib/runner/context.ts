import { IExpressionContext } from "../expressions/evaluator";
import { EnvMap } from "../workflow";

export function mergeEnv(
  ctx: IExpressionContext,
  env?: EnvMap
): IExpressionContext {
  const mergedCtx: IExpressionContext = {
    ...ctx,
  };
  mergedCtx.contexts.env = {
    ...mergedCtx.contexts.env,
    ...env,
  };

  return mergedCtx;
}
