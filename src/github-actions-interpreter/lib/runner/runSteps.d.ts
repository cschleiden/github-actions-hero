import { IExpressionContext } from "../expressions/evaluator";
import { RuntimeStep } from "../runtimeModel";
import { Step } from "../workflow";
export declare function _executeSteps(steps: Step[], jobCtx: IExpressionContext): RuntimeStep[];
