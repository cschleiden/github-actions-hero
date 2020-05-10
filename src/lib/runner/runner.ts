import { evaluateExpression, replaceExpressions } from "../expressions";
import { IExpressionContext } from "../expressions/evaluator";
import {
  Conclusion,
  Event,
  RuntimeModel,
  RuntimeStep,
  State,
  StepType,
} from "../runtimeModel";
import { Job, JobMap, On, Step, Workflow } from "../workflow";
import { getBaseContext, mergeEnv } from "./context";
import { filterBranches, filterPaths } from "./glob/glob";

export class RunError extends Error {}

/** Evaluate a single `if` expression */
function _evIf(
  input: string | undefined,
  ctx: IExpressionContext
): boolean | undefined {
  if (!input) {
    return undefined;
  }

  return !!evaluateExpression(input, ctx);
}

function _ev(
  input: string | undefined,
  ctx: IExpressionContext
): string | undefined {
  if (!input) {
    return input;
  }

  return replaceExpressions(input, ctx);
}

export function run(
  event: Event,
  workflowFilename: string,
  workflow: Workflow
): RuntimeModel {
  const ctx: IExpressionContext = getBaseContext(
    workflowFilename,
    event,
    workflow.env
  );

  const result: RuntimeModel = {
    event,
    name: _ev(workflow.name, ctx) || workflowFilename,
    jobs: [],
  };

  // Check if any event matches
  if (!_match(event, workflow.on)) {
    return result;
  }

  // Run jobs in dependency order
  const orderedJobs = _sortJobs(workflow.jobs);
  for (const { jobId, level } of orderedJobs) {
    const jobDef = workflow.jobs[jobId];
    const jobCtx = mergeEnv(ctx, jobDef.env);

    let conclusion = Conclusion.Success;

    // Should we run this job?
    if (!!jobDef.if) {
      if (!_evIf(jobDef.if, jobCtx)) {
        conclusion = Conclusion.Skipped;
      }
    }

    result.jobs.push({
      id: jobId,
      runnerLabel: Array.isArray(jobDef["runs-on"])
        ? jobDef["runs-on"]
        : [jobDef["runs-on"]],
      name: _ev(jobDef.name, jobCtx) || jobId,
      steps: _executeSteps(jobDef.steps, jobCtx),
      state: State.Done,
      conclusion,
      level,
      dependsOn: Array.isArray(jobDef.needs) ? jobDef.needs : [jobDef.needs],
    });
  }

  return result;
}

export function _sortJobs(jobs: JobMap): { jobId: string; level: number }[] {
  const toNeeds = (job: Job): string[] =>
    Array.isArray(job.needs) ? job.needs : !!job.needs ? [job.needs] : [];

  const result: { jobId: string; level: number }[] = [];

  // Add nodes without dependencies to the queue
  const s: (string | null)[] = Object.keys(jobs).filter(
    (jobId) => toNeeds(jobs[jobId]).length === 0
  );
  s.push(null);
  const done = new Set<string>();

  let level = 0;
  while (s.length > 0) {
    const n = s.shift();

    if (n == null) {
      if (s.length == 0) {
        break;
      }

      ++level;
      s.push(null);
      continue;
    }

    result.push({
      jobId: n,
      level,
    });
    done.add(n);

    // This unblocks all jobs that depend on n
    for (const jobId of Object.keys(jobs)) {
      // If job is already done, or already in the queue, skip.
      if (done.has(jobId) || s.some((x) => x === jobId)) {
        continue;
      }

      const n = toNeeds(jobs[jobId]);
      if (n.every((x) => done.has(x))) {
        // All requirements have been fulfilled
        s.push(jobId);
      }
    }
  }

  return result;
}

export function _executeSteps(
  steps: Step[],
  jobCtx: IExpressionContext
): RuntimeStep[] {
  return steps.map((step) => {
    const stepCtx = mergeEnv(jobCtx, step.env);

    let runStep: RuntimeStep;

    if ("run" in step) {
      runStep = {
        stepType: StepType.Run,
        run: step.run,
      };
    } else if ("uses" in step) {
      runStep = {
        stepType: StepType.Uses,
        uses: step.uses,
      };
    } else {
      runStep = {
        stepType: StepType.Docker,
      };
    }

    if (!!step.name) {
      runStep.name = _ev(step.name, stepCtx);
    }

    if (!!step.if) {
      runStep.skipped = !_evIf(step.if, stepCtx);
    }

    return runStep;
  });
}

export function _match(event: Event, on: On): boolean {
  if (typeof on === "string") {
    // Match a single event
    return event.event === on;
  } else if (Array.isArray(on)) {
    // Match one of multiple events
    return on.some((e) => e === event.event);
  } else {
    // Map, check for other properties
    if (on[event.event] === undefined) {
      return false;
    }

    if (on[event.event] === null) {
      return true;
    }

    const oe = on[event.event];
    // Branches
    if ("branches" in oe && "branch" in event) {
      // Workflow listens to specific branches
      return filterBranches(oe.branches, event.branch);
    }

    if ("branches-ignore" in oe && "branch" in event) {
      // Workflow listens to specific branches
      return !filterBranches(oe["branches-ignore"], event.branch);
    }

    // Paths
    if ("paths" in oe && "branch" in event) {
      // Workflow listens to specific branches
      return filterPaths(oe.paths, event.branch);
    }

    if ("paths-ignore" in oe && "branch" in event) {
      // Workflow listens to specific branches
      return !filterPaths(oe["paths-ignore"], event.branch);
    }

    // Activities
    if ("types" in oe && !!oe.types && "action" in event && !!event.action) {
      // Workflow listens to specific actions
      return oe.types.includes(event.action as any);
    }

    return true;
  }
}
