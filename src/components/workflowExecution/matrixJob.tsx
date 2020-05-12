import * as React from "react";
import { RuntimeJob } from "../../lib/runtimeModel";
import { JobBox } from "./jobBox";
import { Step } from "./step";

export const MatrixJob: React.FC<{
  workflowVisId: number;
  connectorId: string;
  title: string;
  jobs: RuntimeJob[];
}> = ({ connectorId, workflowVisId, title, jobs }) => {
  return (
    <JobBox
      workflowVisId={workflowVisId}
      connectorId={connectorId}
      header={<div className="self-center p-2">{title}</div>}
      content={
        <div className="flex flex-row flex-wrap">
          {jobs.map((job) => (
            <div className="flex-0 border border-gray-500 rounded bg-white shadow m-3">
              {job.steps.map((step, stepIdx) => (
                <li key={stepIdx}>
                  <Step step={step} />
                </li>
              ))}
            </div>
          ))}
        </div>
      }
    />
  );
};
