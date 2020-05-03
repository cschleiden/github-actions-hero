import {
  Event,
  RuntimeEnv,
  RuntimeModel,
  RuntimeStep,
  StepType,
} from "./runtimeModel";
import { Job, JobMap, On, Step, Workflow } from "./workflow";

export class RunError extends Error {}

export function run(
  events: Event[],
  workflowFilename: string,
  workflow: Workflow
): RuntimeModel {
  const result: RuntimeModel = {
    name: workflow.name || workflowFilename,
    jobs: [],
  };

  // Check if any event matches
  if (!events.some((event) => _match(event.event, workflow.on))) {
    return result;
  }

  const orderedJobs = _sortJobs(workflow.jobs);
  for (const { jobId, level } of orderedJobs) {
    const jobDef = workflow.jobs[jobId];

    result.jobs.push({
      name: jobDef.name || jobId,
      steps: _executeSteps(jobDef.steps),
      state: "finished",
      conclusion: "success",
      level,
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

export function _executeSteps(steps: Step[]): RuntimeStep[] {
  return steps.map((step) => {
    if ("run" in step) {
      return {
        stepType: StepType.Run,
        run: step.run,
      };
    } else if ("uses" in step) {
      return {
        stepType: StepType.Uses,
        uses: step.uses,
      };
    }

    return {
      stepType: StepType.Docker,
    };
  });
}

export function _match(event: string, on: On): boolean {
  if (typeof on === "string") {
    return event === on;
  } else if (Array.isArray(on)) {
    return on.some((e) => e === event);
  } else {
    return !!on[event];
  }
}

export function _evaluateExpression(
  expression: string,
  env: RuntimeEnv
): string | boolean | number | null {
  return false;
}
