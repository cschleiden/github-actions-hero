import { Lesson } from "./lesson";

export const matrixJob: Lesson = {
  title: `Matrix job`,
  description: `Often you need to build or test different combinations of operating systems or libraries. You could write individual workflows jobs, or define a single job with a [matrix](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix) strategy.

The following job needs to build the \`frontend\` and \`backend\` \`component\` for \`version\`s 8, 10, and 12. Complete the matrix.`,
  workflow: `name: Build matrix

on: push

jobs:
  matrix:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        version: [8, 10, 12]
%        %
    steps:
    - run: ./build.sh --version=\${{ matrix.version }} \${{ matrix.component }}`,
  events: [
    {
      event: "push",
    },
  ],

  success: (r) =>
    r.every(
      (x) =>
        x.jobs.length === 6 &&
        x.jobs.filter((j) => j.name.indexOf("frontend") !== -1).length === 3 &&
        x.jobs.filter((j) => j.name.indexOf("backend") !== -1).length === 3
    ),
};
