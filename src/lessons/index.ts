import { filterByAction } from "./filterByAction";
import { filterByPaths } from "./filterByPaths";
import { filterPullRequestByBranch } from "./filterPullRequestByBranch";
import { Lesson } from "./lesson";
import { matrixJob } from "./matrixJob";
import { matrixRunsOn } from "./matrixRunsOn";
import { runForMultipleEvents } from "./runForMultipleEvents";
import { runOnPush } from "./runOnPush";
import { runShellScript } from "./runShellScript";
import { runsOnWindows } from "./runsOnWindows";
import { skipJobIf } from "./skipJobIf";
import { skipStepIf } from "./skipStepIf";
import { useCheckoutAction } from "./useCheckoutAction";
import { useSecret } from "./useSecret";

/**
 * List of lessons to display in lesson mode. Order here is the order in which they are displayed
 * in the UI.
 */
export const Lessons: Lesson[] = [
  runOnPush,
  runForMultipleEvents,
  filterPullRequestByBranch,
  filterByAction,
  filterByPaths,
  runShellScript,
  useCheckoutAction,
  runsOnWindows,
  // runSchedule,
  useSecret,
  skipJobIf,
  skipStepIf,
  matrixJob,
  matrixRunsOn,
];
