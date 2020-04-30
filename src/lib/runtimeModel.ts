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

export interface RuntimeJob {
  name: string;

  steps: RuntimeStep[];

  state: any;
  conclusion: any;

  level: number;
}

export interface RuntimeModel {
  name: string;

  jobs: RuntimeJob[];
}
