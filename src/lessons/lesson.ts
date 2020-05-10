import { Event, RuntimeModel, StepType } from "../lib/runtimeModel";

export interface Lesson {
  /**
   * Title will be shown in the form of `Lesson #: {title}`
   */
  title: string;

  /**
   * Description of lesson, supports Markdown
   */
  description: string;

  /**
   * Workflow file content. Use % to mark editable lines. Only the first one is important, use more than one to ensure
   * the editor includes the desired amount of whitespace.
   */
  workflow: string;

  /**
   * The events happening for this workflow
   */
  events: Event[];

  /**
   * Checks when is this lesson solved. By default it checks for `echo "Success!"`. If given a string,
   * that string needs to be "executed" in a `run` step. Otherwise pass a custom evaluator.
   */
  success?: string | ((r: RuntimeModel[]) => boolean);
}

export function lessonSolved(lesson: Lesson, r: RuntimeModel[]): boolean {
  if (!lesson.success || typeof lesson.success === "string") {
    let requiredRun =
      typeof lesson.success === "string" ? lesson.success : `echo "Success!"`;

    // Need to solve this for each trigger.
    return lesson.events.every((e) =>
      r
        // TODO: Ignore any filters for now
        .filter((x) => x.event.event === e.event)
        .every((x) =>
          x.jobs.some((job) =>
            job.steps.some(
              (step) =>
                (step.stepType === StepType.Run && step.run === requiredRun) ||
                (step.stepType === StepType.Uses && step.uses === requiredRun)
            )
          )
        )
    );
  }

  // Lesson provided a custom success check, run it.
  return lesson.success(r);
}
