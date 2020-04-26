import { Lesson } from "./lesson";

export const Lesson2: Lesson = {
  description: "Trigger a workflow when an issue is labeled",

  workflow: `name: Lesson 2

@on: [push] @

steps:
  lesson2:
    steps:
    - runs: echo "Success!`,

  runtimeModel: {},
};
