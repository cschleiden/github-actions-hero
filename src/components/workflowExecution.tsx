import { BranchName, StyledOcticon } from "@primer/components";
import Octicon, { Check, GitBranch, Icon, Skip } from "@primer/octicons-react";
import dynamic from "next/dynamic";
import * as React from "react";
import {
  Conclusion,
  Event,
  RuntimeJob,
  RuntimeModel,
  RuntimeStep,
  StepType,
} from "../lib/runtimeModel";

const DynamicConnections = dynamic<any>(
  () => import("../external/react-connect-elements/index"),
  {
    ssr: false,
  }
);

function makeSafeForCSS(name: string): string {
  return name.replace(/[^a-z0-9]/g, function (s) {
    var c = s.charCodeAt(0);
    if (c == 32) return "-";
    if (c >= 65 && c <= 90) return "_" + s.toLowerCase();
    return "__" + ("000" + c.toString(16)).slice(-4);
  });
}

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
      className={`border border-gray-500 rounded bg-white shadow relative mr-12 ${
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

export const Step: React.FC<{
  step: RuntimeStep;
}> = ({ step }) => {
  switch (step.stepType) {
    case StepType.Run:
      return (
        <div className="p-1 text-sm">
          <code>$ {step.run}</code>
        </div>
      );
  }

  return <div>Step</div>;
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
        <div className="events py-2 flex justify-center">
          {/* Events for workflow */}
          {events.map((e) => (
            <div
              key={e.event}
              className="border border-gray-500 rounded bg-gray-500 shadow relative p-3 mr-12 text-center"
              style={{ width: "240px" }}
            >
              <div className="font-bold">{e.event}</div>
              {(() => {
                switch (e.event) {
                  case "push":
                  case "pull_request":
                    return (
                      (!!e.branches && (
                        <div>
                          <Octicon icon={GitBranch} className="mr-1" />
                          <BranchName>{e.branches.join()}</BranchName>
                        </div>
                      )) ||
                      null
                    );
                }
              })()}

              <div
                className="absolute rounded-b-full shadow bg-gray-500 border border-gray-500 border-t-0"
                style={{
                  width: "20px",
                  height: "10px",
                  bottom: "-9.5px",
                  right: "20px",
                }}
              >
                <div
                  className={`absolute bg-gray-200 rounded-full c-${id}-${makeSafeForCSS(
                    e.event
                  )}`}
                  style={{
                    bottom: "4px",
                    left: "4px",
                    width: "10px",
                    height: "10px",
                  }}
                />
              </div>
            </div>
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
        {connections && connections.length > 0 && (
          <DynamicConnections
            selector={`.workflow-${id}`}
            elements={connections.map((c) => ({ from: c[0], to: c[1] }))}
            strokeWidth={2}
          />
        )}
      </div>
    </>
  );
};
