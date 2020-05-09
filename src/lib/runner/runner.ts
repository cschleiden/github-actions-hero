import GitHubPushContext from "../../data/push-payload.json";
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

export class RunError extends Error {}

function evIf(
  input: string | undefined,
  ctx: IExpressionContext
): boolean | undefined {
  if (!input) {
    return undefined;
  }

  return !!evaluateExpression(input, ctx);
}

export function run(
  event: Event,
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

  const result: RuntimeModel = {
    event,
    name: ev(workflow.name) || workflowFilename,
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

    let conclusion = Conclusion.Success;

    // Should we run this job?
    if (!!jobDef.if) {
      if (!evIf(jobDef.if, ctx)) {
        conclusion = Conclusion.Skipped;
      }
    }

    result.jobs.push({
      id: jobId,
      name: ev(jobDef.name) || jobId,
      steps: _executeSteps(jobDef.steps, ctx),
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
  ctx: IExpressionContext
): RuntimeStep[] {
  return steps.map((step) => {
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

    if (!!step.if) {
      runStep.skipped = !evIf(step.if, ctx);
    }

    return runStep;
  });
}

export function _match(event: Event, on: On): boolean {
  if (typeof on === "string") {
    return event.event === on;
  } else if (Array.isArray(on)) {
    return on.some((e) => e === event.event);
  } else {
    // Map, check for other properties
    if (!on[event.event]) {
      return false;
    }

    switch (event.event) {
      case "pull_request":
        if (!!on["pull_request"]["branches"]) {
          // TODO: Support glob filtering
          const branches: string[] = on["pull_request"]["branches"];
          return (
            branches.some((b) => b === "*") ||
            branches.indexOf(event.branch) !== -1
          );
        }
    }
  }
}
