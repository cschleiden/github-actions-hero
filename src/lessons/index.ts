import { Lesson } from "./lesson";

export const Lessons: Lesson[] = [
  {
    title: `Run on push`,

    description: `Every workflow runs when a certain event is triggered. To start, let's create a workflow that runs on every \`push\` to the current repository.`,

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

    description: `Workflows can run arbitrary shell commands. Let's have our workflow execute the \`./scriptDeploy.sh\` script.`,

    workflow: `name: Lesson 3

on: [push]

jobs:
  lesson3:
    runs-on: ubuntu-latest
    steps:
    @

`,

    triggers: ["push"],

    success: `./scriptDeploy.sh`,

    runtimeModel: {
      name: "Lesson 3",
      jobs: [],
    },
  },
  {
    title: `Multiple jobs`,

    description: "Now, let's have our workflow say 'Success'. ",

    workflow: `name: Lesson 3

on: [push]

jobs:
  lesson4-1:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Job 1"
  lesson4-2:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Job 2"
  lesson4-3:
    runs-on: ubuntu-latest
    needs: [lesson4-2]
    steps:
    - run: echo "Job 3"
  lesson4-4:
    runs-on: ubuntu-latest
    needs: [lesson4-3]
    steps:
    - run: echo "Job 4"
  lesson4-5:
    runs-on: ubuntu-latest
    needs: [lesson4-3]
    steps:
    - run: echo "Job 5"
    @
`,

    triggers: ["push"],

    runtimeModel: {
      name: "Lesson 4",
      jobs: [],
    },
  },
];
