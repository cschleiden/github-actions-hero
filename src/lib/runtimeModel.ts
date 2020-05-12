import { IssueActivities, PullRequestActivities } from "./events/activities";

//
// Events
//
export type Branch = {
  branch?: string;
};

export type Files = {
  files?: string[];
};

export type OnEvent<TEvent extends string> = {
  event: TEvent;
};

export type Action<TActivities> = {
  action?: TActivities;
};

export interface ScheduleEvent {
  event: "schedule";

  cron: string;
}

export type Event =
  | (OnEvent<"push"> & Branch & Files)
  | (OnEvent<"pull_request"> & Branch & Files & Action<PullRequestActivities>)
  | (OnEvent<"issues"> & Action<IssueActivities>);
// | ScheduleEvent;

//
// Steps
//
export enum StepType {
  Uses,
  Docker,
  Run,
}

export interface RuntimeRunStep {
  name?: string;

  stepType: StepType.Run;

  run: string;
}

export interface RuntimeUsesStep {
  stepType: StepType.Uses;

  uses: string;
}

export interface RuntimeDockerStep {
  stepType: StepType.Docker;
}

export type RuntimeStep = (
  | RuntimeRunStep
  | RuntimeUsesStep
  | RuntimeDockerStep
) & {
  /** Custom name */
  name?: string;

  /** Was this step skipped or not */
  skipped?: boolean;
};

//
//
//
export enum State {
  Queued,
  Running,
  Done,
}

export enum Conclusion {
  Success,
  Failure,
  Skipped,
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
  matrix?: string;

  /** Ids of jobs this job depends on */
  dependsOn: string[];
}

export interface RuntimeModel {
  /** Event that triggered this run */
  event: Event;

  /** Overall name */
  name: string;

  /** Executed jobs */
  jobs: RuntimeJob[];
}

// TODO: Set contexts etc.
// TODO: REplace with expression context?
export interface RuntimeEnv {}
