import { IExpressionContext, RuntimeContexts } from "../expressions/evaluator";
import { Event } from "../runtimeModel";
import { EnvMap } from "../workflow";
export declare function getBaseContext(workflow: string, event: Event, env: EnvMap, additionalContexts?: Partial<RuntimeContexts>): IExpressionContext;
export declare function mergeEnv(ctx: IExpressionContext, env?: EnvMap): IExpressionContext;
