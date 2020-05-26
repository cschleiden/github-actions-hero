import { RuntimeJob } from "../../lib/runtimeModel";

/**
 * Group jobs according to their level (distance from the root in the dependency graph)
 * @param jobs List of jobs
 */
export function groupJobs(jobs: RuntimeJob[]): RuntimeJob[][] {
  const groups: RuntimeJob[][] = [];

  let level = 0;
  while (true) {
    const currentLevel = jobs.filter((j) => j.level == level);

    if (currentLevel.length > 0) {
      groups.push(currentLevel);
    }

    if (currentLevel.length == 0) {
      break;
    }

    ++level;
  }

  return groups;
}
