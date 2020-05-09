import { filterPullRequestByBranch } from "./filterPullRequestByBranch";
import { Lesson } from "./lesson";
import { runForMultipleEvents } from "./runForMultipleEvents";
import { runOnPush } from "./runOnPush";
import { runSchedule } from "./runSchedule";
import { runShellScript } from "./runShellScript";
import { skipStepIf } from "./skipStepIf";
import { useCheckoutAction } from "./useCheckoutAction";

/**
 * List of lessons to display in lesson mode. Order here is the order in which they are displayed
 * in the UI.
 */
export const Lessons: Lesson[] = [
  runOnPush,
  runForMultipleEvents,
  filterPullRequestByBranch,
  runShellScript,
  useCheckoutAction,
  runSchedule,
  skipStepIf,
];
