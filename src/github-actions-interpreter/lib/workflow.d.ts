import { IssueActivities, PullRequestActivities } from "./events/activities";
/** Generic map */
export declare type KeyValueMap = {
    [key: string]: string | number | boolean;
};
export interface OnTypes<T extends string> {
    types?: T[];
}
export interface OnBranches {
    branches?: string[];
    "branches-ignore"?: string[];
    tags?: string[];
    "tags-ignore"?: string[];
}
export interface OnPaths {
    paths?: string[];
    "paths-ignore"?: string[];
}
export declare type On = string | string[] | {
    issues?: null | OnTypes<IssueActivities>;
    push?: null | (OnBranches & OnPaths);
    pull_request?: null | (OnBranches & OnTypes<PullRequestActivities> & OnPaths);
};
export interface RunStep {
    run: string;
    "working-directory"?: string;
    shell?: any;
}
export declare type Expression = string;
export interface UsesStep {
    uses: string;
}
export declare type Step = {
    id?: string;
    /** Skips this step if evaluates to falsy */
    if?: Expression;
    /** Optional custom name for a step */
    name?: string | Expression;
    with?: KeyValueMap;
    env?: EnvMap;
    "continue-on-error"?: boolean;
    "timeout-minutes"?: number;
} & (RunStep | UsesStep);
export interface Job {
    name?: string | Expression;
    needs?: string | string[];
    "runs-on": string | string[];
    outputs?: {
        [outputId: string]: string;
    };
    env?: EnvMap;
    defaults?: any;
    if?: Expression;
    steps: Step[];
    "timeout-minutes"?: number;
    strategy?: Strategy;
    "continue-on-error"?: boolean;
    container?: any;
    services?: any;
}
export declare type MatrixValues = string | number | string[] | number[];
export interface Strategy {
    matrix: {
        [key: string]: MatrixValues;
    };
    "fail-fast"?: boolean;
    "max-parallel"?: number;
}
export declare type EnvMap = KeyValueMap;
export declare type JobMap = {
    [jobId: string]: Job;
};
export interface Workflow {
    name?: string;
    on: On;
    env?: EnvMap;
    defaults?: any;
    jobs: JobMap;
}
