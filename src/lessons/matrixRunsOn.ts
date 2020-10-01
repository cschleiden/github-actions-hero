import { Lesson } from "./lesson";
import {
  ResultLesson13 as Result,
  Lesson13RunnerLabel,
  MatrixJob,
} from "../types";

const getLengthOfLabel = (
  matrix: MatrixJob<string, Lesson13RunnerLabel>[],
  label: Lesson13RunnerLabel
) => {
  return matrix.filter(
    (j) => j.runnerLabel.length === 1 && j.runnerLabel.includes(label)
  ).length;
};

export const matrixRunsOn: Lesson = {
  title: `Matrix runs-on`,
  description: `You can also use the [\`matrix\`](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#contexts) context in others expressions. The following workflow should run on Windows, Linux, and MacOS but currently everything is run on Linux.

Update it so that the correct runners are used`,
  workflow: `name: Matrix runs-on

on: push

jobs:
  matrix:
%    runs-on: ubuntu-latest%
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]

    steps:
    - run: echo "Should run on '\${{ matrix.os }}'`,
  events: [
    {
      event: "push",
    },
  ],

  success: (r: Result[]) => {
    const matrixLengthShouldBe = 3;
    const numberOfJobsSHouldBe = 1;

    // there should only be one job.
    const job = r[0].jobs[0];

    const matrix = job.matrixJobs;
    const matrixLength = matrix.length;

    const numberOfUbuntuJobs = getLengthOfLabel(matrix, "ubuntu-latest");
    const numberOfMacosJobs = getLengthOfLabel(matrix, "macos-latest");
    const numberOfWindowsJobs = getLengthOfLabel(matrix, "windows-latest");

    return (
      matrixLength === matrixLengthShouldBe &&
      numberOfUbuntuJobs === numberOfJobsSHouldBe &&
      numberOfMacosJobs === numberOfJobsSHouldBe &&
      numberOfWindowsJobs === numberOfJobsSHouldBe
    );
  },
};
