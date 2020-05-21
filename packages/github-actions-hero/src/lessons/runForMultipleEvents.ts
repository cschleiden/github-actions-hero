import { Lesson } from "./lesson";

export const runForMultipleEvents: Lesson = {
  title: `Run for multiple events`,

  description: `Workflows can also run when any of [multiple events](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#example-using-a-list-of-events) occur.

Currently this workflow runs on every \`push\`, update it so that is also runs whenever any of the \`issues\` in the repository is modified.`,

  workflow: `name: Multiple Events

%on: [push] %

jobs:
  lesson2:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Success!"`,

  events: [
    {
      event: "push",
    },
    {
      event: "issues",
    },
  ],
};
