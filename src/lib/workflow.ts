/** Generic map */
type KeyValueMap = { [key: string]: string | number | boolean };

interface OnTypes {
  types: string[];
}

type On = string | string[] | { [on: string]: OnTypes };

interface RunStep {
  run: string;

  "working-directory"?: string;

  shell?: any;
}

interface CheckoutStep {
  uses: string;
}

type Step = {
  id?: string;

  if?: any;

  name?: string;

  with?: KeyValueMap;

  env?: EnvMap;

  "continue-on-error"?: boolean;

  "timeout-minutes"?: number;
} & (RunStep | CheckoutStep);

interface Job {
  name?: string;

  needs?: string | string[];

  "runs-on": string | string[];

  outputs?: { [outputId: string]: string };

  env?: EnvMap;

  defaults?: any;

  if?: any;

  steps: Step;

  "timeout-minutes"?: number;

  strategy?: Strategy;

  "continue-on-error"?: boolean;

  container?: any;

  services?: any;
}

interface Strategy {
  matrix: { [key: string]: string[] };

  "fail-fast"?: boolean;

  "max-parallel"?: number;
}

type EnvMap = KeyValueMap;

interface Workflow {
  name?: string;

  on: On;

  env?: EnvMap;

  defaults?: any;

  jobs: { [jobId: string]: Job };
}
