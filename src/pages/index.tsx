import { Button, ButtonPrimary } from "@primer/components";
import Link from "next/link";
import * as React from "react";
import { Badge } from "../components/badge";

export default () => {
  return (
    <div className="flex flex-1 flex-col justify-center items-center h-screen">
      <Badge />
      <h1 className="text-center">Become a GitHub Actions Hero</h1>
      <div className="flex flex-col items-center">
        <Link href="/lessons/[lesson]" as="/lessons/1">
          <ButtonPrimary variant="large" className="m-3">
            Interactive Lessons
          </ButtonPrimary>
        </Link>
        <Link href="/playground">
          <Button className="m-3">Playground</Button>
        </Link>
      </div>
      <div className="mt-32 text-gray-700 text-center">
        <p>
          Small, interactive tutorial for the GitHub Actions workflow syntax
          with an emulated workflow parser and runner.
        </p>
        <p>
          See{" "}
          <a
            href="https://lab.github.com/githubtraining/github-actions:-hello-world"
            target="_blank"
          >
            GitHub Learning Labs
          </a>{" "}
          for an official offering.
        </p>
      </div>
    </div>
  );
};
