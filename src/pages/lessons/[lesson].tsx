import { ButtonPrimary, Flash, Pagination } from "@primer/components";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Router from "next/router";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { WorkflowExecution } from "../../components/workflowExecution";
import { Lessons } from "../../lessons";
import { lessonSolved } from "../../lessons/lesson";
import { parse } from "../../lib/parser";
import { run } from "../../lib/runner";
import { RuntimeModel } from "../../lib/runtimeModel";
import { Workflow } from "../../lib/workflow";

const DynamicEditor = dynamic(
  () => import("../../components/workflowEditor").then((x) => x.Editor),
  {
    loading: () => <p>Loading ...</p>,
    ssr: false,
  }
);

const LessonPage: NextPage<{ lesson: number }> = ({ lesson }) => {
  const l = Lessons[lesson - 1];

  const [input, setInput] = React.useState(l.workflow);

  let parsedWorkflow: Workflow;
  let outcome: boolean | undefined;

  try {
    parsedWorkflow = parse(input);
  } catch (e) {
    // TODO: Show in UI
    console.log("Parsing error", e);
  }

  let workflowExecution: RuntimeModel | undefined;

  // Run
  try {
    const result = run(
      l.triggers,
      `.github/workflows/lesson-${lesson}.yaml`,
      parsedWorkflow
    );

    workflowExecution = result;
    outcome = lessonSolved(l, result);
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
        <div className="flex justify-center p-3">
          <h1>GitHub Actions 🦸</h1>
        </div>
        {/* Header */}
        <div className="flex items-center">
          <div className="flex-1 flex justify-start ">
            <h2>Lesson {lesson}</h2>
          </div>
          <div className="flex flex-initial justify-end">
            <Pagination
              pageCount={Lessons.length}
              currentPage={lesson}
              marginPageCount={1}
              surroundingPageCount={2}
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
          <DynamicEditor workflow={l.workflow} change={(v) => setInput(v)} />
        </div>

        <div>
          {outcome !== undefined ? (
            outcome ? (
              <Flash scheme="green">
                <div className="flex items-center">
                  <div className="flex-1">
                    Success! Now move on to the next one.
                  </div>
                  <div className="self-end">
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
                  </div>
                </div>
              </Flash>
            ) : (
              <Flash scheme="red">Please try again.</Flash>
            )
          ) : null}
        </div>
      </div>

      <div
        className="flex-1 bg-gray-300 rounded-md rounded-l-none h-screen p-12"
        style={{ minWidth: "60vw" }}
      >
        <WorkflowExecution
          triggers={l.triggers}
          executionModel={workflowExecution}
        />
      </div>
    </div>
  );
};

LessonPage.getInitialProps = (context) => {
  const lesson = parseInt(context.query["lesson"] as string, 10);

  return { lesson };
};

export default LessonPage;
