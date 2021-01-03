import { RuntimeContexts } from "../expressions/evaluator";
import { Event, RuntimeModel } from "../runtimeModel";
import { JobMap, On, Workflow } from "../workflow";
export declare class RunError extends Error {
}
export declare function run(event: Event, workflowFilename: string, workflow: Workflow, additionalContexts?: Partial<RuntimeContexts>): RuntimeModel;
export declare function _sortJobs(jobs: JobMap): {
    jobId: string;
    level: number;
}[];
export declare function _match(event: Event, on: On): boolean;
