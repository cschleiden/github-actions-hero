import { Lesson } from "./lesson";
import { ResultLesson12 as Result, MatrixJob, Lesson12Name } from "../types";

const getLenghtOfName = (
  matrix: MatrixJob<Lesson12Name, string>[],
  name: Lesson12Name
) => {
  return matrix.filter((j) => j.name.indexOf(name) !== -1).length;
};

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

  success: (r: Result[]) => {
    const matrixLengthShouldBe = 6;
    const numberOfFeJobsShouldBe = 3;
    const numberOfBeJobsShouldBe = 3;
    // there should only be one job.

    const job = r[0].jobs[0];

    const matrix = job.matrixJobs;
    const matrixLength = matrix.length;

    const feJobsLength = getLenghtOfName(matrix, "frontend");

    const beJobsLength = getLenghtOfName(matrix, "backend");

    return (
      matrixLength === matrixLengthShouldBe &&
      numberOfFeJobsShouldBe === feJobsLength &&
      numberOfBeJobsShouldBe === beJobsLength
    );
  },
};
