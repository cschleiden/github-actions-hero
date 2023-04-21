import { Lesson } from "./lesson";

export const filterPullRequestByBranch: Lesson = {
  title: `Validate pull requests`,

  description: `We have seen that workflows can run when a single event, or when one of multiple events happens. It is also possible to limit workflow execution to certain [branches](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpull_requestpull_request_targetbranchesbranches-ignore) or [tags](hthttps://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushbranchestagsbranches-ignoretags-ignore).

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
