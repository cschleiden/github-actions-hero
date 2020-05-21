import { Lesson } from "./lesson";

export const useCheckoutAction: Lesson = {
  title: `Use reusable action`,

  description: `In most cases you want to do something with the content of your repository. To get a copy of the repository you can use the \`actions/checkout\` action.

Add a [\`uses\`](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsuses) step that uses \`actions/checkout\` version \`v2\`:`,

  workflow: `name: Checkout

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    %
    - run: ./build.sh
`,

  events: [
    {
      event: "push",
    },
  ],

  success: `actions/checkout@v2`,
};
