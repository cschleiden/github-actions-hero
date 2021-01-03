import { IssueActivities, PullRequestActivities } from "./events/activities";
import { EnvMap } from "./workflow";
export declare type Branch = {
    branch?: string;
};
export declare type Files = {
    files?: string[];
};
export declare type OnEvent<TEvent extends string> = {
    event: TEvent;
};
export declare type Action<TActivities> = {
    action?: TActivities;
};
export interface ScheduleEvent {
    event: "schedule";
    cron: string;
}
export declare type Event = (OnEvent<"push"> & Branch & Files) | (OnEvent<"pull_request"> & Branch & Files & Action<PullRequestActivities>) | (OnEvent<"issues"> & Action<IssueActivities>);
export declare enum StepType {
    Uses = 0,
    Docker = 1,
    Run = 2
}
export interface RuntimeRunStep {
    stepType: StepType.Run;
    name?: string;
    run: string;
}
export interface RuntimeUsesStep {
    stepType: StepType.Uses;
    uses: string;
}
export interface RuntimeDockerStep {
    stepType: StepType.Docker;
}
export declare type RuntimeStep = (RuntimeRunStep | RuntimeUsesStep | RuntimeDockerStep) & {
    /** Custom name */
    name?: string;
    /** Was this step skipped or not */
    skipped?: boolean;
    /** Environment variables evaluated for this step */
    env?: EnvMap;
};
export declare enum State {
    Queued = 0,
    Running = 1,
    Done = 2
}
export declare enum Conclusion {
    Success = 0,
    Failure = 1,
    Skipped = 2
}
export interface RuntimeJob {
    id: string;
    name: string;
    /** Labels of the runners who ran the workflow */
    runnerLabel: string[];
    steps: RuntimeStep[];
    state: State;
    conclusion: Conclusion;
    /** Used for display purposes, distance from the root */
    level: number;
    /** Id of the matrix generating job, if a matrix job */
    matrixJobs?: RuntimeJob[];
    /** Ids of jobs this job depends on */
    dependsOn: string[];
    /** Environment variables evaluated for this job */
    env: EnvMap;
}
export interface RuntimeModel {
    /** Event that triggered this run */
    event: Event;
    /** Overall name */
    name: string;
    /** Executed jobs */
    jobs: RuntimeJob[];
}
export interface RuntimeEnv {
}
