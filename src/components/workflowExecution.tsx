import * as React from "react";
import {
  RuntimeJob,
  RuntimeModel,
  RuntimeStep,
  StepType,
} from "../lib/runtimeModel";

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
  triggers: string[];
  executionModel: RuntimeModel;
}> = ({ triggers, executionModel }) => {
  return (
    <div className="bg-gray-300 p-3">
      <div className="triggers py-2 flex justify-center">
        {triggers.map((t) => (
          <div
            key={t}
            className="border border-gray-500 rounded bg-gray-500 shadow relative p-3 text-center font-bold  mr-12"
            style={{ width: "240px" }}
          >
            {t}

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
                className="absolute bg-gray-200 rounded-full"
                style={{
                  bottom: "4px",
                  left: "4px",
                  width: "10px",
                  height: "10px",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="my-6">
        {groupJobs(executionModel?.jobs || []).map((jobs) => (
          <div className="flex flex-row justify-center py-6">
            {jobs.map((job) => (
              <div
                className="border border-gray-500 rounded bg-white shadow relative mr-12"
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
                    className="absolute bg-gray-600 rounded-full"
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
                    className="absolute bg-blue-400 rounded-full"
                    style={{
                      bottom: "4px",
                      left: "4px",
                      width: "10px",
                      height: "10px",
                    }}
                  ></div>
                </div>
                <div className="p-2 bg-gray-200 rounded rounded-b-none text-center font-bold">
                  {job.name}
                </div>
                <div className="p-2">
                  <ul>
                    {job.steps.map((step) => (
                      <li>
                        <Step step={step} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* <div>
        <pre>{executionModel && JSON.stringify(executionModel, null, 2)}</pre>
      </div> */}
    </div>
  );
};
