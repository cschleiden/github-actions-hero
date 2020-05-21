import { Lesson } from "./lesson";

export const runsOnWindows: Lesson = {
  title: `Run on Windows`,
  description: `Actions provides hosted runners for [Windows, Linux, and MacOS](https://help.github.com/en/actions/reference/virtual-environments-for-github-hosted-runners). For every job, you can specify where it should run with the [\`runs-on\`](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on) property.

So far, all workflows ran on the latest version of Ubuntu, let's update this workflow to run on the latest version of Windows.`,
  workflow: `name: Windows

on: push

jobs:
  say-hello:
%    runs-on: ubuntu-latest
    steps:
    - run: echo "Success!"`,
  events: [
    {
      event: "push",
    },
  ],

  success: (r) =>
    r.every((x) =>
      x.jobs.every((j) => j.runnerLabel.includes("windows-latest"))
    ),
};
