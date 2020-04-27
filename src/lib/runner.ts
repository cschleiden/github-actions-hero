import { RuntimeModel, RuntimeStep, StepType } from "./runtimeModel";
import { Job, JobMap, On, Step, Workflow } from "./workflow";

export class RunError extends Error {}

export async function run(
  events: string[],
  workflowFilename: string,
  workflow: Workflow
): Promise<RuntimeModel> {
  const result: RuntimeModel = {
    name: workflow.name || workflowFilename,
    jobs: [],
  };

  // Check if any event matches
  if (!events.some((event) => match(event, workflow.on))) {
    return result;
  }

  const orderedJobs = sortJobs(workflow.jobs);
  for (const jobId of orderedJobs) {
    const jobDef = workflow.jobs[jobId];

    result.jobs.push({
      name: jobDef.name || jobId,
      steps: executeSteps(jobDef.steps),
      state: "finished",
      conclusion: "success",
    });
  }

  return result;
}

function sortJobs(jobs: JobMap): string[] {
  const toNeeds = (job: Job): string[] =>
    Array.isArray(job.needs) ? job.needs : !!job.needs ? [job.needs] : [];

  const result: string[] = [];

  // Add nodes without dependencies to the queue
  const s = Object.keys(jobs).filter((jobId) => {
    const job = jobs[jobId];
    return toNeeds(job).length === 0;
  });
  const done = new Set<string>();

  while (s.length > 0) {
    const n = s.shift();
    result.push(n);
    done.add(n);

    // This unblocks all jobs that depend on n
    for (const jobId of Object.keys(jobs)) {
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

function executeSteps(steps: Step[]): RuntimeStep[] {
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

function match(event: string, on: On): boolean {
  if (typeof on === "string") {
    return event === on;
  } else if (Array.isArray(on)) {
    return on.some((e) => e === event);
  } else {
    return !!on[event];
  }
}
