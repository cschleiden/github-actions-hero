import { Label } from "@primer/components";
import * as React from "react";
import { RuntimeModel } from "../lib/runtimeModel";

export const WorkflowExecution: React.FC<{
  triggers: string[];
  executionModel: RuntimeModel;
}> = ({ triggers, executionModel }) => {
  return (
    <div>
      <div className="triggers">
        {triggers.map((t) => (
          <Label variant="large" key={t}>
            {t}
          </Label>
        ))}
      </div>
      <div>
        <pre>{executionModel && JSON.stringify(executionModel, null, 2)}</pre>
      </div>
    </div>
  );
};
