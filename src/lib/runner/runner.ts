import { IExpressionContext, RuntimeContexts } from "../expressions/evaluator";
import { Event, RuntimeModel, RuntimeStep, StepType } from "../runtimeModel";
import { Job, JobMap, On, Step, Workflow } from "../workflow";
import { getBaseContext, mergeEnv } from "./context";
import { _ev, _evIf, _evMap } from "./expressions";
import { filterBranch, filterPaths } from "./glob/glob";
import { executeJob } from "./runJobs";

export class RunError extends Error {}

export function run(
  event: Event,
  workflowFilename: string,
  workflow: Workflow,
  additionalContexts?: Partial<RuntimeContexts>
): RuntimeModel {
  const ctx: IExpressionContext = getBaseContext(
    workflowFilename,
    event,
    workflow.env,
    additionalContexts
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

    result.jobs.push(executeJob(jobId, jobDef, level, jobCtx));
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
  return steps.map((stepDef) => {
    const stepCtx = mergeEnv(jobCtx, stepDef.env);

    let step: RuntimeStep;

    if ("run" in stepDef) {
      step = {
        stepType: StepType.Run,
        run: _ev(stepDef.run, jobCtx),
      };
    } else if ("uses" in stepDef) {
      step = {
        stepType: StepType.Uses,
        uses: stepDef.uses,
      };
    } else {
      step = {
        stepType: StepType.Docker,
      };
    }

    if (!!stepDef.name) {
      step.name = _ev(stepDef.name, stepCtx);
    }

    if (!!stepDef.if) {
      step.skipped = !_evIf(stepDef.if, stepCtx);
    }

    step.env = _evMap(stepDef.env, jobCtx);

    return step;
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
      return filterBranch(oe.branches, event.branch);
    }

    if ("branches-ignore" in oe && "branch" in event) {
      // Workflow listens to specific branches
      return !filterBranch(oe["branches-ignore"], event.branch);
    }

    // Paths
    if ("paths" in oe && "files" in event) {
      // Workflow listens to specific files
      return filterPaths(oe.paths, event.files || []);
    }

    if ("paths-ignore" in oe && "files" in event) {
      // Workflow listens to specific files
      return !filterPaths(oe["paths-ignore"], event.files || []);
    }

    // Activities
    if ("types" in oe && !!oe.types && "action" in event && !!event.action) {
      // Workflow listens to specific actions
      return oe.types.includes(event.action as any);
    }

    return true;
  }
}
