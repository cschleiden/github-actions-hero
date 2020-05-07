import GitHubPushContext from "../data/push-payload.json";
import { evaluateExpression, replaceExpressions } from "./expressions";
import { IExpressionContext } from "./expressions/evaluator";
import {
  Conclusion,
  Event,
  RuntimeEnv,
  RuntimeModel,
  RuntimeStep,
  State,
  StepType,
} from "./runtimeModel";
import { Job, JobMap, On, Step, Workflow } from "./workflow";

export class RunError extends Error {}

export function run(
  events: Event[],
  workflowFilename: string,
  workflow: Workflow
): RuntimeModel {
  const ctx: IExpressionContext = {
    contexts: {
      github: GitHubPushContext,
    },
  };

  const ev = (input?: string): string | undefined => {
    if (!input) {
      return input;
    }

    return replaceExpressions(input, ctx);
  };

  const evIf = (input?: string): string | undefined => {
    if (!input) {
      return input;
    }

    return evaluateExpression(input, ctx).result;
  };

  const result: RuntimeModel = {
    name: ev(workflow.name) || workflowFilename,
    jobs: [],
  };

  // Check if any event matches
  if (!events.some((event) => _match(event.event, workflow.on))) {
    return result;
  }

  // Run jobs in dependency order
  const orderedJobs = _sortJobs(workflow.jobs);
  for (const { jobId, level } of orderedJobs) {
    const jobDef = workflow.jobs[jobId];

    let conclusion = Conclusion.Success;

    // Should we run this job?
    if (!!jobDef.if) {
      if (!evIf(jobDef.if)) {
        conclusion = Conclusion.Skipped;
      }
    }

    result.jobs.push({
      id: jobId,
      name: ev(jobDef.name) || jobId,
      steps: _executeSteps(jobDef.steps),
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
