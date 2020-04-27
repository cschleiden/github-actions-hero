import { Lesson } from "./lesson";

export const Lesson1: Lesson = {
  title: `Run on push`,

  description: `To start, let's create a workflow that runs on every \`push\` to the current repository.`,

  workflow: `name: Lesson 1

@on: @

jobs:
  say-hello:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Success!"`,

  triggers: ["push"],

  runtimeModel: {
    name: "Lesson 1",
    jobs: [],
  },
};
