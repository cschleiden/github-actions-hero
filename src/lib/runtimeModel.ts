enum StepType {
  Uses,
  Docker,
  Run,
}

export interface RuntimeStep {
  stepType: StepType;
}

export interface RuntimeJob {
  name: string;

  steps: RuntimeStep[];

  state: any;
  conclusion: any;
}

export interface RuntimeModel {
  jobs: RuntimeJob[];
}
