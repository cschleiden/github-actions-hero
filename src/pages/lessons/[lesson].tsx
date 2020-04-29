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

  const [workflowExecution, setWorkflowExecution] = React.useState<
    RuntimeModel | undefined
  >();

  const [outcome, setOutcome] = React.useState<boolean | undefined>();

  const workflowInput = React.useRef(l.workflow);

  React.useEffect(() => {
    // This is not great, double renders. Change later.

    // Lesson changed, reset
    setOutcome(undefined);
    setWorkflowExecution(undefined);
  }, [lesson]);

  return (
    <div className="p-4">
      <div className="flex justify-center p-3">
        <h1>GitHub Actions 🦸</h1>
      </div>
      <div className="flex items-center p-3">
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
      <div className="flex">
        <div className="flex flex-col flex-1 rounded-md rounded-r-none p-3">
          <div className="markdown-body py-3">
            <ReactMarkdown source={l.description} />
          </div>
          <div>
            <DynamicEditor
              workflow={l.workflow}
              change={(v) => (workflowInput.current = v)}
            />
          </div>
          <div className="self-end py-3">
            <ButtonPrimary
              className="p-2"
              onClick={async () => {
                let parsedWorkflow: Workflow;
                try {
                  parsedWorkflow = parse(workflowInput.current);
                } catch (e) {
                  // TODO: Show in UI
                  console.log("Parsing error", e);
                }

                // Run
                try {
                  const result = await run(
                    l.triggers,
                    `.github/workflows/lesson-${lesson}.yaml`,
                    parsedWorkflow
                  );

                  setWorkflowExecution(result);

                  setOutcome(lessonSolved(l, result));
                } catch (e) {
                  console.log("Runtime error", e);
                }
              }}
            >
              Run workflow
            </ButtonPrimary>
          </div>
        </div>
        <div className="flex-1 bg-gray-300 rounded-md rounded-l-none">
          <div>
            <WorkflowExecution
              triggers={l.triggers}
              executionModel={workflowExecution}
            />
          </div>
          <div>
            {outcome !== undefined ? (
              outcome ? (
                <Flash m={4} scheme="green">
                  Success! Now move on to the next one.
                </Flash>
              ) : (
                <Flash m={4} scheme="red">
                  Please try again.
                </Flash>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

LessonPage.getInitialProps = (context) => {
  const lesson = parseInt(context.query["lesson"] as string, 10);

  return { lesson };
};

export default LessonPage;
