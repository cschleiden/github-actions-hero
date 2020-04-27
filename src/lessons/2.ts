import { Lesson } from "./lesson";

export const Lesson2: Lesson = {
  title: `Run for multiple events`,

  description:
    "Workflows can be run for multiple triggers. Let's change our workflow so that in addition to `push` it also runs whenever the `issues` event occurs.",

  workflow: `name: Lesson 2

@on: [push] @

jobs:
  lesson2:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Success!"`,

  triggers: ["issues"],

  runtimeModel: {
    name: "Lesson 2",
    jobs: [],
  },
};
