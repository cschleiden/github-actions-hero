import { any } from "micromatch";

export type Lesson12Name = "frontend" | "backend";

export type Lesson13RunnerLabel =
  | "ubuntu-latest"
  | "windows-latest"
  | "macos-latest";

export interface ResultBase<T> {
  event: any;
  jobs: {
    matrixJobs: T[];
  };
}

export interface MatrixJob<T = string, S = string> {
  name: T;
  runnerLabel: S[];
}

export interface ResultLesson12
  extends Omit<ResultBase<MatrixJob<Lesson12Name>>, "event"> {}

export interface ResultLesson13
  extends Pick<ResultBase<MatrixJob<string, Lesson13RunnerLabel>>, "jobs"> {}
