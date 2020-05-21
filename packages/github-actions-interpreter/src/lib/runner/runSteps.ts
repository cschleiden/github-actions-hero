import { IExpressionContext } from "../expressions/evaluator";
import { RuntimeStep, StepType } from "../runtimeModel";
import { Step } from "../workflow";
import { mergeEnv } from "./context";
import { _ev, _evIf, _evMap } from "./expressions";

export function _executeSteps(
  steps: Step[],
  jobCtx: IExpressionContext
): RuntimeStep[] {
  return steps.map((stepDef) => {
    const stepCtx = mergeEnv(jobCtx, stepDef.env);

    let step: RuntimeStep;

    if ("run" in stepDef) {
      step = {
        stepType: StepType.Run,
        run: _ev(stepDef.run, jobCtx),
      };
    } else if ("uses" in stepDef) {
      step = {
        stepType: StepType.Uses,
        uses: stepDef.uses,
      };
    } else {
      step = {
        stepType: StepType.Docker,
      };
    }

    if (!!stepDef.name) {
      step.name = _ev(stepDef.name, stepCtx);
    }

    if (!!stepDef.if) {
      step.skipped = !_evIf(stepDef.if, stepCtx);
    }

    step.env = _evMap(stepDef.env, jobCtx);

    return step;
  });
}
