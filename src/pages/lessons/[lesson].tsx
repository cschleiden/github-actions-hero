import { ButtonPrimary, Flash, Pagination } from "@primer/components";
import { YAMLException } from "js-yaml";
import { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { DynamicEditor } from "../../components/dynamicEditor";
import { WorkflowExecution } from "../../components/workflowExecution/workflowExecution";
import { Lessons } from "../../lessons";
import { lessonSolved } from "../../lessons/lesson";
import { ExpressionError } from "../../lib/expressions";
import { parse, ParseError } from "../../lib/parser/parser";
import { run } from "../../lib/runner/runner";
import { Event, RuntimeModel } from "../../lib/runtimeModel";

function _run(
  events: Event[],
  input: string
): {
  workflowExecution: Map<Event, RuntimeModel>;
  err: Error | undefined;
} {
  let workflowExecution = new Map<Event, RuntimeModel>();
  let err: Error | undefined;

  try {
    const parsedWorkflow = parse(input);

    for (const event of events) {
      const result = run(
        event,
        `.github/workflows/workflow.yaml`,
        parsedWorkflow
      );

      workflowExecution.set(event, result);
    }
  } catch (e) {
    err = e;
  }

  return {
    workflowExecution,
    err,
  };
}

const LessonPage: NextPage<{ lesson: number }> = ({ lesson }) => {
  const l = Lessons[lesson - 1];

  const [outcome, setOutcome] = React.useState<boolean | undefined>();
  const [err, setErr] = React.useState<Error | undefined>();

  const [workflowExecution, setWorkflowExecution] = React.useState<
    Map<Event, RuntimeModel>
  >();

  React.useEffect(() => {
    // Perform initial run when the lesson has changed to generate the execution graph
    const { workflowExecution } = _run(l.events, l.workflow.replace(/%/g, ""));
    setErr(undefined);
    setOutcome(undefined);
    setWorkflowExecution(workflowExecution);
  }, [l]);

  const onChange = React.useCallback(
    (input: string) => {
      const { workflowExecution, err } = _run(l.events, input);

      setWorkflowExecution(workflowExecution);
      setErr(err);
      if (!err) {
        const outcome = lessonSolved(l, Array.from(workflowExecution.values()));
        setOutcome(outcome);
      } else {
        setOutcome(undefined);
      }
    },
    [l]
  );

  return (
    <div className="flex flex-row">
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
        <div className="flex items-center">
          <div className="flex-1 justify-start">
            <h2>Lesson {lesson}</h2>
            <h3>{l.title}</h3>
          </div>
          <div className="flex flex-initial justify-end">
            <Pagination
              pageCount={Lessons.length}
              currentPage={lesson}
              marginPageCount={1}
              surroundingPageCount={1}
              onPageChange={(e, page) => {
                Router.push(`/lessons/[lesson]`, `/lessons/${page}`);
                e.preventDefault();
              }}
            />
          </div>
        </div>

        <div className="markdown-body my-4">
          <ReactMarkdown source={l.description} />
        </div>

        <div className="flex flex-col flex-1">
          <DynamicEditor key={lesson} workflow={l.workflow} change={onChange} />
        </div>

        <div className="mt-2">
          {outcome && (
            <Flash scheme="green">
              <div className="flex items-center">
                <div className="flex-1">
                  Success! Now move on to the next one.
                </div>
                <div className="self-end">
                  {lesson < Lessons.length ? (
                    <ButtonPrimary
                      onClick={() =>
                        Router.push(
                          `/lessons/[lesson]`,
                          `/lessons/${lesson + 1}`
                        )
                      }
                    >
                      Next
                    </ButtonPrimary>
                  ) : (
                    <div>You are done!</div>
                  )}
                </div>
              </div>
            </Flash>
          )}
          {err && (
            <Flash scheme="red">
              {(() => {
                switch (true) {
                  case err instanceof YAMLException:
                    return <div>Parsing error: {err.message}</div>;

                  case err instanceof ParseError:
                    return <div>Validation error: {err.message}</div>;

                  case err instanceof ExpressionError:
                    return <div>Expression error: {err.message}</div>;
                }
              })()}
            </Flash>
          )}
        </div>
      </div>

      <div className="flex-1 bg-gray-300 h-screen overflow-auto flex flex-row justify-center">
        {workflowExecution &&
          l.events.map((event, idx) => (
            <WorkflowExecution
              key={`${event.event}-${idx}`}
              id={idx}
              events={[event]}
              executionModel={workflowExecution.get(event)}
            />
          ))}
      </div>
    </div>
  );
};

LessonPage.getInitialProps = (context) => {
  const lesson = parseInt(context.query["lesson"] as string, 10);

  return { lesson };
};

export default LessonPage;
