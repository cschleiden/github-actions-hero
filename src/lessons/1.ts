import { Lesson } from "./lesson";

export const Lesson1: Lesson = {
  description:
    "Let's create a workflow that runs for every push to the repository.",

  workflow: `name: Lesson 1

@on: @

steps:
  lesson1:
    steps:
    - runs: echo "Success!`,

  runtimeModel: {},
};
