/** Generic map */
export type KeyValueMap = { [key: string]: string | number | boolean };

export interface OnTypes {
  types: string[];
}

export type On = string | string[] | { [on: string]: OnTypes };

export interface RunStep {
  run: string;

  "working-directory"?: string;

  shell?: any;
}

export type Expression = string;

export interface UsesStep {
  uses: string;
}

export type Step = {
  id?: string;

  /** Skips this step if evaluates to falsy */
  if?: Expression;

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

  outputs?: { [outputId: string]: string };

  env?: EnvMap;

  // TODO
  defaults?: any;

  if?: Expression;

  steps: Step[];

  "timeout-minutes"?: number;

  strategy?: Strategy;

  "continue-on-error"?: boolean;

  // TODO
  container?: any;

  // TODO
  services?: any;
}

export interface Strategy {
  matrix: { [key: string]: string[] };

  "fail-fast"?: boolean;

  "max-parallel"?: number;
}

export type EnvMap = KeyValueMap;

export type JobMap = { [jobId: string]: Job };

export interface Workflow {
  name?: string;

  on: On;

  env?: EnvMap;

  // TODO
  defaults?: any;

  jobs: JobMap;
}
