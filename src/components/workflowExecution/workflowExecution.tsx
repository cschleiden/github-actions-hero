import { StyledOcticon } from "@primer/components";
import { Check, Icon, Skip } from "@primer/octicons-react";
import dynamic from "next/dynamic";
import * as React from "react";
import {
  Conclusion,
  Event,
  RuntimeJob,
  RuntimeModel,
} from "../../lib/runtimeModel";
import { WorkflowEvent } from "./event";
import { Step } from "./step";
import { makeSafeForCSS } from "./utils";

const DynamicConnections = dynamic<any>(
  () => import("../../external/react-connect-elements/index"),
  {
    ssr: false,
  }
);

function conclusionToIcon(conclusion: Conclusion): Icon {
  switch (conclusion) {
    case Conclusion.Skipped:
      return Skip;

    default:
      return Check;
  }
}

export const Job: React.FC<{
  workflowVisId: number;
  job: RuntimeJob;
}> = ({ workflowVisId, job }) => {
  return (
    <div
      key={job.id}
      className={`border border-gray-500 rounded bg-white shadow relative mx-3 last:mr-0 ${
        job.conclusion == Conclusion.Skipped ? "opacity-50" : ""
      }`}
      style={{ width: "240px" }}
    >
      <div
        className="absolute bg-gray-200 rounded-t-full border border-b-0 border-gray-500"
        style={{
          width: "20px",
          height: "10px",
          top: "-10px",
          left: "20px",
        }}
      >
        <div
          className={`absolute bg-gray-600 rounded-full ci-${workflowVisId}-${makeSafeForCSS(
            job.id
          )}`}
          style={{
            top: "4px",
            left: "4px",
            width: "10px",
            height: "10px",
          }}
        ></div>
      </div>
      <div
        className="absolute rounded-b-full shadow bg-white border border-t-0"
        style={{
          width: "20px",
          height: "10px",
          bottom: "-9.5px",
          right: "20px",
        }}
      >
        <div
          className={`absolute bg-blue-400 rounded-full co-${workflowVisId}-${makeSafeForCSS(
            job.id
          )}`}
          style={{
            bottom: "4px",
            left: "4px",
            width: "10px",
            height: "10px",
          }}
        ></div>
      </div>
      <div className="flex flex-row bg-gray-200 rounded rounded-b-none ">
        <div className="self-center p-2">
          <StyledOcticon icon={conclusionToIcon(job.conclusion)} />
        </div>
        <div className="p-2 text-center font-bold flex-1">{job.name}</div>
      </div>
      <div className="p-2">
        <ul>
          {job.steps.map((step, stepIdx) => (
            <li key={stepIdx}>
              <Step step={step} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/**
 * Group jobs according to their level (distance from the root in the dependency graph)
 * @param jobs List of jobs
 */
function groupJobs(jobs: RuntimeJob[]): RuntimeJob[][] {
  const result: RuntimeJob[][] = [];

  let level = 0;
  while (true) {
    let currentLevel = jobs.filter((j) => j.level == level);
    if (currentLevel.length == 0) {
      break;
    }

    result.push(currentLevel);
    ++level;
  }

  return result;
}

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
    events.forEach((e) => {
      jobGroups[0]?.forEach((job) => {
        c.push([
          `.c-${id}-${makeSafeForCSS(e.event)}`,
          `.ci-${id}-${makeSafeForCSS(job.id)}`,
        ]);
      });
    });

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
        <div className="events py-2 flex justify-center">
          {/* Events for workflow */}
          {events.map((e) => (
            <WorkflowEvent key={e.event} id={id} event={e} />
          ))}
        </div>
        <div className="my-6">
          {jobGroups.map((jobGroup, groupIdx) => (
            <div key={groupIdx} className="flex flex-row justify-center py-8">
              {jobGroup.map((job) => (
                <Job key={job.id} workflowVisId={id} job={job} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
