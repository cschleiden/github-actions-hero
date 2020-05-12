import dynamic from "next/dynamic";
import * as React from "react";
import { Event, RuntimeModel } from "../../lib/runtimeModel";
import { WorkflowEvent } from "./event";
import { Job } from "./job";
import { groupJobs } from "./jobGroup";
import { MatrixJob } from "./matrixJob";
import { makeSafeForCSS } from "./utils";

const DynamicConnections = dynamic<any>(
  () => import("../../external/react-connect-elements/index"),
  {
    ssr: false,
  }
);

export const WorkflowExecution: React.FC<{
  id: number;
  events: Event[];
  executionModel: RuntimeModel;
}> = ({ id, events, executionModel }) => {
  const [connections, setConnections] = React.useState<[string, string][]>([]);
  const jobGroups = groupJobs(executionModel?.jobs || []);

  // Render connections once the current model has been rendered since it needs to read the element positions
  React.useEffect(() => {
    let c: [string, string][] = [];

    // Connect all first-level jobs to the events
    // events.forEach((e) => {
    //   jobGroups[0]?.forEach((job) => {
    //     c.push([
    //       `.c-${id}-${makeSafeForCSS(e.event)}`,
    //       `.ci-${id}-${makeSafeForCSS(job.id)}`,
    //     ]);
    //   });
    // });

    executionModel?.jobs
      .filter((x) => x.level > 0)
      .forEach((job) => {
        job.dependsOn.forEach((dependendJobId) => {
          c.push([
            `.ci-${id}-${makeSafeForCSS(job.id)}`,
            `.co-${id}-${makeSafeForCSS(dependendJobId)}`,
          ]);
        });
      });

    setConnections(c);
  }, [events, executionModel]);

  return (
    <>
      <div className={`bg-gray-300 p-3 workflow-${id} relative`}>
        {connections && connections.length > 0 && (
          <DynamicConnections
            selector={`.workflow-${id}`}
            elements={connections.map((c) => ({ from: c[0], to: c[1] }))}
            strokeWidth={2}
          />
        )}
        <div className="events pb-2 flex justify-center">
          {/* Events for workflow */}
          {events.map((e) => (
            <WorkflowEvent key={e.event} id={id} event={e} />
          ))}
        </div>
        <div className="my-6">
          {jobGroups.map((jobGroup, groupIdx) => {
            if (jobGroup.type === "group") {
              return (
                <div key={groupIdx} className="flex flex-row flex-wrap py-8">
                  {jobGroup.jobs.map((job) => (
                    <Job key={job.id} workflowVisId={id} job={job} />
                  ))}
                </div>
              );
            } else if (jobGroup.type === "matrix") {
              return (
                <MatrixJob
                  workflowVisId={id}
                  title={"matrix"}
                  connectorId={"23"}
                  jobs={jobGroup.jobs}
                />
              );
            }
          })}
        </div>
      </div>
    </>
  );
};
