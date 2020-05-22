import { CheckIcon, SkipIcon } from "@primer/octicons-v2-react";
import * as React from "react";
import { Conclusion } from "../lib/runtimeModel";

export function conclusionToIcon(conclusion: Conclusion): JSX.Element {
  switch (conclusion) {
    case Conclusion.Skipped:
      return <SkipIcon />;

    default:
      return <CheckIcon />;
  }
}
