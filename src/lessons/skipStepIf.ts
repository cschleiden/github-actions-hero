import { Lesson } from "./lesson";

export const skipStepIf: Lesson = {
  title: `Skip steps`,

  description: `Sometimes you want to skip certain steps. Use an expression to run \`build.sh\` only when the current ref is \`refs/heads/master\`.`,

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
  ],

  success: `actions/checkout%v2`,
};
