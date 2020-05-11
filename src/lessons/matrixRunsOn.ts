import { Lesson } from "./lesson";

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

  success: (r) =>
    r.every(
      (x) =>
        x.jobs.length === 3 &&
        x.jobs.filter(
          (j) =>
            j.runnerLabel?.length > 0 && j.runnerLabel[0] === "ubuntu-latest"
        ).length === 1 &&
        x.jobs.filter(
          (j) =>
            j.runnerLabel?.length > 0 && j.runnerLabel[0] === "windows-latest"
        ).length === 1 &&
        x.jobs.filter(
          (j) =>
            j.runnerLabel?.length > 0 && j.runnerLabel[0] === "macos-latest"
        ).length === 1
    ),
};
