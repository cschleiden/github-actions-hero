import { CheckIcon, Icon, SkipIcon } from "@primer/octicons-v2-react";
import { Conclusion } from "../../lib/runtimeModel";

export function conclusionToIcon(conclusion: Conclusion): Icon {
  switch (conclusion) {
    case Conclusion.Skipped:
      return SkipIcon;

    default:
      return CheckIcon;
  }
}
