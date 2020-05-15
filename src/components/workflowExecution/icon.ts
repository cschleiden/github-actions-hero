import { Check, Icon, Skip } from "@primer/octicons-react";
import { Conclusion } from "../../lib/runtimeModel";

export function conclusionToIcon(conclusion: Conclusion): Icon {
  switch (conclusion) {
    case Conclusion.Skipped:
      return Skip;

    default:
      return Check;
  }
}
