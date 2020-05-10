import { StepType } from "../lib/runtimeModel";
import { Lesson } from "./lesson";

export const skipStepIf: Lesson = {
  title: `Skip Step`,

  description: `Sometimes you also want to skip certain steps. Use an [\`if\`](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsif) expression to run \`build.sh\` only when the current ref is \`refs/heads/master\`.`,

  workflow: `name: Skip Step

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - run: ./build.sh
      if: \${{ false }} %
    - run: echo "Hello!"
`,

  events: [
    {
      event: "push",
      branch: "master",
    },
    {
      event: "push",
      branch: "develop",
    },
  ],

  success: (r) => {
    return (
      r
        .find((r) => r.event.event == "push" && r.event.branch == "master")
        .jobs.every(
          (j) =>
            j.steps.find(
              (s) => s.stepType === StepType.Run && s.run === "./build.sh"
            ).skipped === false
        ) &&
      r
        .find((r) => r.event.event == "push" && r.event.branch == "develop")
        .jobs.every(
          (j) =>
            j.steps.find(
              (s) => s.stepType === StepType.Run && s.run === "./build.sh"
            ).skipped === true
        )
    );
  },
};
