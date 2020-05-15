import * as React from "react";
import { RuntimeJob } from "../../lib/runtimeModel";
import { Job } from "./job";
import { JobBox } from "./jobBox";

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
            <Job workflowVisId={workflowVisId} job={job} connectable={false} />
          ))}
        </div>
      }
    />
  );
};
