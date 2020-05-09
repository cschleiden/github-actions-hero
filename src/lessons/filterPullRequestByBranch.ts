import { Lesson } from "./lesson";

export const filterPullRequestByBranch: Lesson = {
  title: `Validate pull requests`,

  description: `We have seen that workflows can run when a single event, or when one of multiple events happens. It is also possible to limit workflow execution to certain [branches or tags](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#onpushpull_requestbranchestags).

This workflow should run only when a \`pull_request\` to the \`master\` branch is opened.
`,

  workflow: `name: Pull Requests to master

on:
  pull_request:
    branches:
%      - '*'%

jobs:
  say-hello:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Success!"`,

  events: [
    {
      event: "pull_request",
      branch: "master",
    },
    {
      event: "pull_request",
      branch: "develop",
    },
  ],

  success: (r) => {
    return (
      r
        .filter(
          (x) =>
            x.event.event === "pull_request" &&
            x.event.branch.indexOf("develop") !== -1
        )
        .every((x) => x.jobs.length === 0) &&
      r
        .filter(
          (x) =>
            x.event.event === "pull_request" &&
            x.event.branch.indexOf("master") !== -1
        )
        .every((x) => x.jobs.length > 0)
    );
  },
};
