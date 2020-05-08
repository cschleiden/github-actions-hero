import { Lesson } from "./lesson";

export const Lessons: Lesson[] = [
  {
    title: `Run on push`,

    description: `Workflows [run](https://help.github.com/en/actions/reference/events-that-trigger-workflows#about-workflow-events) when a specific activity happens on GitHub, at a scheduled time, or when an event outside of GitHub occurs.

Every workflow declares which event should trigger it by setting [\`on\`](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#on) to a string identifying an event.

To get started, let's run this workflow whenever the \`push\` event occurs.`,

    workflow: `name: For every push

@on: @

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
  },
  {
    title: `Run for multiple events`,

    description: `Workflows can also run when any of [multiple events](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#example-using-a-list-of-events) occur.

Currently this workflow runs on every \`push\`, update it so that is also runs whenever any of the \`issues\` in the repository is modified.`,

    workflow: `name: Multiple Events

@on: [push] @

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
  },
  {
    title: `Validate pull requests`,

    description: `We have seen that workflows can run when a single event, or when one of multiple events happens. It is also possible to limit workflow execution to certain [branches or tags](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#onpushpull_requestbranchestags).

This workflow should run only when a \`pull_request\` to the \`master\` branch is opened.
`,

    workflow: `name: Pull Requests to master

on:
  pull_request:
    branches:
@      - '*'@

jobs:
  say-hello:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Success!"`,

    events: [
      {
        event: "pull_request",
        branches: ["master"],
      },
      {
        event: "pull_request",
        branches: ["develop"],
      },
    ],

    success: (r) => {
      console.log(r);
      return (
        r
          .filter(
            (x) =>
              x.event.event === "pull_request" &&
              x.event.branches.indexOf("develop") !== -1
          )
          .every((x) => x.jobs.length === 0) &&
        r
          .filter(
            (x) =>
              x.event.event === "pull_request" &&
              x.event.branches.indexOf("master") !== -1
          )
          .every((x) => x.jobs.length > 0)
      );
    },
  },
  {
    title: `Execute shell scripts`,

    description: `So far our workflows have just \`echo\`'d \`"Success!\`. That's great but doesn't provide that much value. Often you want build some code, or deploy a service.

As an example, let's have our workflow execute the \`./scriptDeploy.sh\` shell script.`,

    workflow: `name: Deploy

on: [push]

jobs:
  lesson3:
    runs-on: ubuntu-latest
    steps:
    @

`,

    events: [
      {
        event: "push",
      },
    ],

    success: `./scriptDeploy.sh`,
  },
  {
    title: `Scheduled workflows`,

    description: `Workflows can also run at specific times. GitHub Actions supports [POSIX cron syntax](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#onschedule). Workflows can run at most every 5 minutes.`,

    workflow: `on:
  schedule:
@    - cron:  ''`,

    events: [
      {
        event: "schedule",
        cron: "*/15 * * * *",
      },
    ],
  },
];
