import { RuntimeJob } from "../lib/runtimeModel";
/**
 * Group jobs according to their level (distance from the root in the dependency graph)
 * @param jobs List of jobs
 */
export declare function groupJobs(jobs: RuntimeJob[]): RuntimeJob[][];
