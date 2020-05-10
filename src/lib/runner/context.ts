import { IExpressionContext } from "../expressions/evaluator";
import { Event } from "../runtimeModel";
import { EnvMap } from "../workflow";

export function getBaseContext(
  workflow: string,
  event: Event,
  env: EnvMap
): IExpressionContext {
  return {
    contexts: {
      github: {
        token: "thisisasecrettoken",
        job: "first",
        ref: `refs/heads/${("branch" in event && event.branch) || "master"}`,
        sha: "825e127fcace28992b3688a96f78fe4d55e1e145",
        repository: "cschleiden/github-actions-hero",
        repositoryUrl: "git://github.com/cschleiden/github-actions-hero.git",
        run_id: "42",
        run_number: "23",
        actor: "cschleiden",
        workflow,
        head_ref: "825e127fcace28992b3688a96f78fe4d55e1e145",
        base_ref: "",
        event_name: event.event,
      },
      env,
    },
  };
}

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
