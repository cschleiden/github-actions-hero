import { RuntimeModel, StepType } from "../lib/runtimeModel";

export interface Lesson {
  /**
   * Title will be shown in the form of `Lesson #: {title}`
   */
  title: string;

  /**
   * Description of lesson
   */
  description: string;

  /**
   * Workflow file content. Use @ to mark editable lines. Only the first is important, use more than one to ensure
   * the editor includes the desired amount of whitespace.
   */
  workflow: string;

  /**
   * The events happening for this workflow
   */
  triggers: string[];

  /**
   * When is this lesson solved. By default it checks for `echo "Success!"`. If given a string, that string needs to be
   * executed in a `run` step. Otherwise pass a custom evaluator.
   */
  success?: string | ((r: { [trigger: string]: RuntimeModel }) => boolean);

  /**
   *
   */
  runtimeModel: RuntimeModel;
}

export function lessonSolved(
  lesson: Lesson,
  r: { [trigger: string]: RuntimeModel }
): boolean {
  if (!lesson.success || typeof lesson.success === "string") {
    let requiredRun =
      typeof lesson.success === "string" ? lesson.success : `echo "Success!"`;

    // Need to solve this for each trigger
    return lesson.triggers.every((trigger) =>
      r[trigger].jobs.some((job) =>
        job.steps.some(
          (step) => step.stepType === StepType.Run && step.run === requiredRun
        )
      )
    );
  }

  return lesson.success(r);
}
