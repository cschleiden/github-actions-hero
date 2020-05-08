import { NextPage } from "next";
import dynamic from "next/dynamic";
import * as React from "react";
import { WorkflowExecution } from "../components/workflowExecution";
import { parse } from "../lib/parser";
import { run } from "../lib/runner";
import { Event, RuntimeModel } from "../lib/runtimeModel";
import { Workflow } from "../lib/workflow";

const defaultEvents: Event[] = [
  {
    event: "push",
    branch: "master",
  },
];

const defaultWorkflow = `name: Playground

on: [push]

jobs:
  lesson4-1:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Job 1"
  lesson4-2:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Job 2"
  lesson4-3:
    runs-on: ubuntu-latest
    needs: [lesson4-2]
    steps:
    - run: echo "Job 3"
  lesson4-4:
    runs-on: ubuntu-latest
    needs: [lesson4-3]
    steps:
    - run: echo "Job 4"
  lesson4-5:
    name: \${{ github.event_name }}-\${{ github.event.ref }}
    if: github.event_name == 'test'
    runs-on: ubuntu-latest
    needs: [lesson4-3]
    steps:
    - run: echo "Job 5"`;

const DynamicEditor = dynamic(
  () => import("../components/workflowEditor").then((x) => x.Editor),
  {
    loading: () => <p>Loading ...</p>,
    ssr: false,
  }
);

const PlaygroundPage: NextPage = () => {
  const [input, setInput] = React.useState(defaultWorkflow);

  let parsedWorkflow: Workflow;

  try {
    parsedWorkflow = parse(input);
  } catch (e) {
    // TODO: Show in UI
    console.log("Parsing error", e);
  }

  let workflowExecution: { [trigger: string]: RuntimeModel } = {};

  // Run
  try {
    for (const event of defaultEvents) {
      const result = run(
        event,
        `.github/workflows/workflow.yaml`,
        parsedWorkflow
      );

      workflowExecution[event.event] = result;
    }
  } catch (e) {
    console.log("Runtime error", e);
  }

  return (
    <div className="flex flex-row">
      <div
        className="flex flex-col p-4"
        style={{
          minWidth: "40vw",
        }}
      >
        <div className="text-center p-3">
          <h1 className="m-0">GitHub Actions Hero</h1>
          <h2>Playground</h2>
        </div>

        <div className="flex flex-col flex-1">
          <DynamicEditor
            workflow={defaultWorkflow}
            change={(v) => setInput(v)}
            everythingEditable={true}
          />
        </div>
      </div>

      <div
        className="flex-1 bg-gray-300 rounded-md rounded-l-none h-screen p-12 flex flex-row"
        style={{ minWidth: "60vw" }}
      >
        {defaultEvents.map((event, idx) => (
          <WorkflowExecution
            key={event.event}
            id={idx}
            events={[event]}
            executionModel={workflowExecution[event.event]}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaygroundPage;
