import { Lesson } from "./lesson";

export const runOnPush: Lesson = {
  title: `Run on push`,
  description: `Workflows [run](https://help.github.com/en/actions/reference/events-that-trigger-workflows#about-workflow-events) when a specific activity happens on GitHub, at a scheduled time, or when an event outside of GitHub occurs.

Every workflow declares which event should trigger it by setting [\`on\`](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#on) to a string identifying an event.

To get started, let's run this workflow whenever the \`push\` event occurs.`,
  workflow: `name: For every push

%on: %

jobs:
  say-hello:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Success!"`,
  events: [
    {
      event: "push",
    },
  ],
};
