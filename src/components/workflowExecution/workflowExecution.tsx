import dynamic from "next/dynamic";
import * as React from "react";
import { Event, RuntimeModel } from "../../lib/runtimeModel";
import { WorkflowEvent } from "./event";
import { Job } from "./job";
import { groupJobs } from "./jobGroup";
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
    const c = (executionModel?.jobs || []).map((j): [string, string][] => {
      const id = makeSafeForCSS(j.id);

      if (!j.dependsOn || j.dependsOn.length === 0) {
        return [["event", `i-${id}`]];
      }

      return j.dependsOn.map(
        (d) => [`o-${makeSafeForCSS(d)}`, `i-${id}`] as [string, string]
      );
    });
    setConnections(
      c.flat(1).map((x) => [`.c-${id}-${x[0]}`, `.c-${id}-${x[1]}`])
    );
    console.log(c.flat(1).map((x) => [`c-${id}-${x[0]}`, `c-${id}-${x[1]}`]));
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
        <div className="my-6 flex flex-col justify-center items-center">
          {jobGroups.map((jobGroup, groupIdx) => {
            return (
              <div key={groupIdx} className="flex flex-row flex-wrap py-8">
                {jobGroup.map((job) => (
                  <Job key={job.id} workflowVisId={id} job={job} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
