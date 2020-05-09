import { ButtonPrimary } from "@primer/components";
import Link from "next/link";
import * as React from "react";

export default () => {
  return (
    <div className="flex flex-1 flex-col justify-center items-center h-screen">
      <h1>Become a GitHub Actions Hero</h1>
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
    </div>
  );
};
