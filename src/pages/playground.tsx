import { Button, Flash, SelectMenu, Tooltip } from "@primer/components";
import {
  CheckIcon,
  ChevronDownIcon,
  ClippyIcon,
} from "@primer/octicons-v2-react";
import {
  Event,
  ExpressionError,
  parse,
  ParseError,
  run,
  RuntimeModel,
  WorkflowExecution,
} from "github-actions-interpreter";
import { YAMLException } from "js-yaml";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { DynamicEditor } from "../components/dynamicEditor";
import { PlaygroundWorkflows } from "../playground/workflows";
import { wait } from "../utils/wait";

const defaultEvents: Event[] = [
  {
    event: "push",
    branch: "master",
  },
];

const PlaygroundPage: NextPage = () => {
  const { query } = useRouter();

  React.useEffect(() => {
    const w: string | undefined = query.w as string;
    console.log(w);
    if (w) {
      const workflowText = decompressFromEncodedURIComponent(w);
      setSelectedWorkflow({
        name: "Custom",
        workflow: workflowText,
      });
      setInput(workflowText);
    }
  }, [query]);

  const [selectedWorkflow, setSelectedWorkflow] = React.useState(
    PlaygroundWorkflows[0]
  );
  const [input, setInput] = React.useState(selectedWorkflow.workflow);
  const [copied, setCopied] = React.useState(false);
  const copyContent = React.useCallback(async () => {
    const urlContent = compressToEncodedURIComponent(input);
    const url = `https://github-actions-hero.now.sh/playground?w=${urlContent}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    await wait(2000);
    setCopied(false);
  }, [input]);

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
    <div className="flex flex-row h-screen">
      <div
        className="flex-1 flex flex-col p-6 h-screen overflow-auto"
        style={{
          minWidth: "45vw",
        }}
      >
        <div className="flex justify-center text-center">
          <Link href="/">
            <a>
              <h1>GitHub Actions Hero</h1>
            </a>
          </Link>
        </div>
        <div className="flex items-center my-3">
          <div className="flex-1 justify-start">
            <h2>Playground</h2>
          </div>
          <div className="flex flex-initial justify-end">
            <SelectMenu>
              <Button as="summary">
                Workflow: {selectedWorkflow.name} <ChevronDownIcon />
              </Button>
              <SelectMenu.Modal>
                <SelectMenu.Header>Example workflows</SelectMenu.Header>
                <SelectMenu.List>
                  {PlaygroundWorkflows.map((pw) => (
                    <SelectMenu.Item
                      key={pw.name}
                      selected={pw === selectedWorkflow}
                      onClick={(ev) => {
                        setSelectedWorkflow(pw);
                        setInput(pw.workflow);
                      }}
                    >
                      {pw.name}
                    </SelectMenu.Item>
                  ))}
                </SelectMenu.List>
              </SelectMenu.Modal>
            </SelectMenu>
            <Tooltip text="Copy link to clipboard" direction="w">
              <Button className="ml-2" onClick={() => copyContent()}>
                {copied ? (
                  <CheckIcon className="text-green-600" />
                ) : (
                  <ClippyIcon />
                )}
              </Button>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <DynamicEditor
            workflow={selectedWorkflow.workflow}
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
                    console.error(err);
                    return <div>{err.message}</div>;
                }
              })()}
            </Flash>
          </div>
        )}
      </div>

      <div className="flex-1 bg-gray-300 p-3 h-screen overflow-auto flex flex-row justify-center flex-wrap">
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
