import * as React from "react";
import { Conclusion } from "../lib/runtimeModel";

export function conclusionToIcon(conclusion: Conclusion): JSX.Element {
  switch (conclusion) {
    case Conclusion.Skipped:
      //return <SkipIcon />;
      return <div>S</div>;

    default:
      // return <CheckIcon />;
      return <div>C</div>;
  }
}
