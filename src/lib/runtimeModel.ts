enum StepType {
  Uses,
  Docker,
  Run,
}

interface RuntimeStep {
  stepType: StepType;
}

interface RuntimeJob {
  name: string;

  steps: RuntimeStep[];
}

interface RuntimeModel {
  jobs: RuntimeJob[];
}
