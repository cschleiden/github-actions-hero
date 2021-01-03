import { IExpressionContext } from "../expressions/evaluator";
import { RuntimeJob } from "../runtimeModel";
import { Job } from "../workflow";
export declare function executeJob(jobId: string, jobDef: Job, level: number, jobCtx: IExpressionContext): RuntimeJob;
