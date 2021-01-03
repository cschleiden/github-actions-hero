import { Conclusion } from "../github-actions-interpreter";
import { Lesson } from "./lesson";

export const skipJobIf: Lesson = {
  title: `Skip Job`,

  description: `Sometimes you want to run jobs only when certain conditions are met. You can use an [\`if\`](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idif) expression to skip and not run jobs.

Update this workflow to only deploy when a change is pushed to the \`production\` branch.

_Hint_: the ref is available in the [\`github\`](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) context.`,

  workflow: `name: Skip job

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - run: ./build.sh
  deploy:
    needs: [build]
    runs-on: ubuntu-latest
%    if: 1 == 1%
    steps:
    - uses: actions/checkout@v2
    - run: ./deploy.sh
`,

  events: [
    {
      event: "push",
      branch: "master",
    },
    {
      event: "push",
      branch: "production",
    },
  ],

  success: (r) => {
    return r.every(
      (x) =>
        x.jobs.find((j) => j.id == "deploy").conclusion ==
        (x.event.event == "push" && x.event.branch == "master"
          ? Conclusion.Skipped
          : Conclusion.Success)
    );
  },
};
