import { ButtonPrimary } from "@primer/components";
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
            Get started
          </ButtonPrimary>
        </Link>
        <Link href="/playground">
          <a>Playground</a>
        </Link>
      </div>
      <div className="mt-32 text-gray-700">
        Small, interactive tutorial for the GitHub Actions workflow syntax with
        an emulated workflow parser and runner.
      </div>
    </div>
  );
};
