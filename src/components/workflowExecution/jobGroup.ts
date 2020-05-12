import { RuntimeJob } from "../../lib/runtimeModel";

export interface JobGroup {
  type: "group" | "matrix";
  jobs: RuntimeJob[];
}

/**
 * Group jobs according to their level (distance from the root in the dependency graph)
 * @param jobs List of jobs
 */
export function groupJobs(jobs: RuntimeJob[]): JobGroup[] {
  const groups: JobGroup[] = [];

  let level = 0;
  while (true) {
    const currentLevel = jobs.filter((j) => j.level == level && !j.matrix);
    const currentMatrixLevel = jobs.filter(
      (j) => j.level == level && !!j.matrix
    );

    if (currentLevel.length > 0) {
      groups.push({
        type: "group",
        jobs: currentLevel,
      });
    }
    if (currentMatrixLevel.length > 0) {
      groups.push({
        type: "matrix",
        jobs: currentMatrixLevel,
      });
    }

    if (currentLevel.length == 0 && currentMatrixLevel.length == 0) {
      break;
    }

    ++level;
  }

  return groups;
}
