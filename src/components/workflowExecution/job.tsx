import { StyledOcticon } from "@primer/components";
import * as React from "react";
import { Conclusion, RuntimeJob } from "../../lib/runtimeModel";
import { conclusionToIcon } from "./icon";
import { JobBox } from "./jobBox";
import { Step } from "./step";

export const Job: React.FC<{
  workflowVisId: number;
  job: RuntimeJob;
}> = ({ workflowVisId, job }) => {
  return (
    <JobBox
      workflowVisId={workflowVisId}
      headerClassname={
        job.conclusion == Conclusion.Skipped ? "opacity-50" : undefined
      }
      connectorId={job.id}
      header={
        <>
          <div className="self-center p-2">
            <StyledOcticon icon={conclusionToIcon(job.conclusion)} />
          </div>
          <div className="p-2 text-center font-bold flex-1">{job.name}</div>
        </>
      }
      content={
        <ul>
          {job.steps.map((step, stepIdx) => (
            <li key={stepIdx}>
              <Step step={step} />
            </li>
          ))}
        </ul>
      }
    />
  );
};
