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
   *
   */
  runtimeModel: RuntimeModel;
}

export function lessonSolved(
  lesson: Lesson,
  runtimeModel: RuntimeModel
): boolean {
  return runtimeModel.jobs.some((job) =>
    job.steps.some(
      (step) => step.stepType === StepType.Run && step.run === `echo "Success!"`
    )
  );
}
