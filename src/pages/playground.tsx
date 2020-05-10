import { Flash } from "@primer/components";
import { YAMLException } from "js-yaml";
import { NextPage } from "next";
import Link from "next/link";
import * as React from "react";
import { Badge } from "../components/badge";
import { DynamicEditor } from "../components/dynamicEditor";
import { WorkflowExecution } from "../components/workflowExecution/workflowExecution";
import { ExpressionError } from "../lib/expressions";
import { parse, ParseError } from "../lib/parser/parser";
import { run } from "../lib/runner/runner";
import { Event, RuntimeModel } from "../lib/runtimeModel";

const defaultEvents: Event[] = [
  {
    event: "push",
    branch: "master",
  },
];

const defaultWorkflow = `name: Playground

on: [push]

env:
  TEST: Okay

jobs:
  lesson4-1:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Job 1"
  lesson4-2:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Job 2"
    - run: echo "Optional step"
      if: \${{ 1 == 2 }}
    - run: echo "Job 2"
  lesson4-3:
    runs-on: ubuntu-latest
    needs: [lesson4-2]
    steps:
    - uses: actions/checkout@v2
    - run: echo "Job 3"
    - run: echo "Job 3"
    - run: echo "Job 3"
      name: Step \${{ env.TEST }}
  lesson4-4:
    name: \${{ github.event_name }}-\${{ github.event.ref }}
    runs-on: ubuntu-latest
    needs: [lesson4-3]
    steps:
    - name: 'Custom name'
      run: echo "Job 4"
  lesson4-5:
    name: Skipped jobx
    if: github.event_name == 'test'
    runs-on: ubuntu-latest
    needs: [lesson4-3]
    steps:
    - run: echo "Job 5"`;

const PlaygroundPage: NextPage = () => {
  const [input, setInput] = React.useState(defaultWorkflow);

  let err: Error | undefined;
  let workflowExecution: { [trigger: string]: RuntimeModel } = {};

  try {
    const parsedWorkflow = parse(input);

    for (const event of defaultEvents) {
      const result = run(
        event,
        `.github/workflows/workflow.yaml`,
        parsedWorkflow
      );

      workflowExecution[event.event] = result;
    }

    err = undefined;
  } catch (e) {
    workflowExecution = {};
    err = e;
  }

  return (
    <div className="flex flex-row">
      <Badge />

      <div
        className="flex flex-col p-6 h-screen overflow-auto"
        style={{
          minWidth: "40vw",
        }}
      >
        <div className="text-center p-3">
          <Link href="/">
            <a>
              <h1>GitHub Actions Hero</h1>
            </a>
          </Link>
          <h2>Playground</h2>
        </div>

        <div className="flex flex-col flex-1">
          <DynamicEditor
            workflow={defaultWorkflow}
            change={(v) => setInput(v)}
            everythingEditable={true}
          />
        </div>

        {err && (
          <div className="mt-2">
            <Flash scheme="red">
              {(() => {
                switch (true) {
                  case err instanceof YAMLException:
                    return <div>Parsing error: {err.message}</div>;

                  case err instanceof ParseError:
                    return <div>Validation error: {err.message}</div>;

                  case err instanceof ExpressionError:
                    return <div>Expression error: {err.message}</div>;

                  default:
                    return <div>{err.message}</div>;
                }
              })()}
            </Flash>
          </div>
        )}
      </div>

      <div
        className="flex-1 bg-gray-300 rounded-md rounded-l-none h-screen overflow-auto p-6 flex flex-row"
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
