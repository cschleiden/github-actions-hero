import * as React from "react";
import { Conclusion, RuntimeJob } from "../lib/runtimeModel";
import { conclusionToIcon } from "./icon";
import { JobBox } from "./jobBox";
import { Step } from "./step";

export const Job: React.FC<{
  className?: string;
  workflowVisId: number;
  job: RuntimeJob;
  connectable?: boolean;
}> = ({ className, workflowVisId, job, connectable = true }) => {
  let content: JSX.Element;
  if (job.matrixJobs) {
    content = (
      <div className="flex flex-row flex-wrap items-stretch justify-center">
        {job.matrixJobs.map((job, idx) => (
          <Job
            key={`${job.id}-${idx}`}
            workflowVisId={workflowVisId}
            job={job}
            connectable={false}
          />
        ))}
      </div>
    );
  } else {
    content = (
      <ul>
        {job.steps.map((step, stepIdx) => (
          <li key={stepIdx}>
            <Step step={step} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <JobBox
      workflowVisId={workflowVisId}
      headerClassname={`${className || ""} ${
        job.conclusion == Conclusion.Skipped ? "opacity-50" : undefined
      }`}
      connectorId={connectable && job.id}
      header={
        <React.Fragment>
          <div className="self-center p-2">
            {conclusionToIcon(job.conclusion)}
          </div>
          <div className="p-2 text-center font-bold flex-1">{job.name}</div>
        </React.Fragment>
      }
      content={content}
    />
  );
};
