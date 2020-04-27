import { Lesson } from "./lesson";

export const Lesson3: Lesson = {
  title: `Run for multiple events`,

  description: "Now, let's have out workflow say 'Success'. ",

  workflow: `name: Lesson 3

on: [push]

jobs:
  lesson3:
    runs-on: ubuntu-latest
    steps:
    @

`,

  triggers: ["push"],

  runtimeModel: {
    name: "Lesson 3",
    jobs: [],
  },
};
