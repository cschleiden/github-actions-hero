export interface PushEvent {
  event: "push";

  branch?: string;
}

export interface IssuesEvent {
  event: "issues";

  action?: "created" | "updated" | "removed";
}

export type Event = PushEvent | IssuesEvent;

export enum StepType {
  Uses,
  Docker,
  Run,
}

export interface RuntimeRunStep {
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

export type RuntimeStep = RuntimeRunStep | RuntimeUsesStep | RuntimeDockerStep;

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

  steps: RuntimeStep[];

  state: State;
  conclusion: Conclusion;

  /** Used for display purposes, distance from the root */
  level: number;

  /** Ids of jobs this job depends on */
  dependsOn: string[];
}

export interface RuntimeModel {
  name: string;

  jobs: RuntimeJob[];
}

// TODO: Set contexts etc.
export interface RuntimeEnv {}
