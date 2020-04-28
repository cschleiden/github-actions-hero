export const Lessons = [
  {
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
  },
  {
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
  },
  {
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
  },
];
