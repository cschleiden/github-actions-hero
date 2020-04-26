import Link from "next/link";
import * as React from "react";

export default () => {
  return (
    <div className="flex flex-1 flex-col justify-center items-center h-screen w-screen">
      <h1>Become a GitHub Actions Hero</h1>
      <Link href="lessons/1">Start</Link>
    </div>
  );
};
