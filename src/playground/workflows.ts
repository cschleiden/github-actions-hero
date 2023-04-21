export const PlaygroundWorkflows = [
  {
    name: "Matrix",
    workflow: `name: Matrix

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - run: ./build.sh

  test:
    needs: build
    runs-on: \${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        browser: [Chrome, Edge, Firefox]
    steps:
    - run: ./executeBrowserTest --browser=\${{ matrix.browser }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - run: ./uploadRelease.sh
`,
  },
  {
    name: "Dependencies",
    workflow: `name: Dependencies

on: [push]

env:
  TEST: 'env value'

jobs:
  independent:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Job 1"
  with-optional-step:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Job 2"
    - run: echo "Optional step"
      if: \${{ 1 == 2 }}
    - run: echo "Job 2"
  dependent:
    runs-on: ubuntu-latest
    needs: [with-optional-step]
    steps:
    - uses: actions/checkout@v3
    - run: echo "Hello"
    - run: echo "World"
    - run: echo "Step with expression name"
      name: Step \${{ env.TEST }}
  custom-name:
    name: 'Custom name: \${{ github.event_name }}-\${{ github.event.ref }}'
    runs-on: ubuntu-latest
    needs: [dependent]
    steps:
    - name: 'Custom name'
      run: echo "Job 4"
  skipped:
    name: Skipped job
    if: github.event_name == 'test'
    runs-on: ubuntu-latest
    needs: [with-optional-step]
    steps:
    - run: echo "Job 5"`,
  },
];
