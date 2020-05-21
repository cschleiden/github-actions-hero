import * as React from "react";
import { RuntimeStep, StepType } from "../lib/runtimeModel";

export const Step: React.FC<{
  step: RuntimeStep;
}> = ({ step }) => {
  let content: JSX.Element = null;

  switch (step.stepType) {
    case StepType.Run:
      content = (
        <div>
          <code>$ {step.run}</code>
          {step.env &&
            Object.keys(step.env).length > 0 &&
            Object.keys(step.env).map((k) => (
              <div className="text-xs">
                <ul className="list-none">
                  <li>
                    <code>
                      {k}={step.env[k]}
                    </code>
                  </li>
                </ul>
              </div>
            ))}
        </div>
      );
      break;

    case StepType.Uses:
      const [name, tag] = step.uses.split("@");
      let href: string | undefined = undefined;
      if (name) {
        href = `https://www.github.com/${name}`;

        if (!!tag) {
          href += `/releases/tag/${tag}`;
        }
      }

      content = (
        <React.Fragment>
          Use:{" "}
          <a target="_blank" href={href}>
            {step.uses}
          </a>
        </React.Fragment>
      );
      break;
  }

  return (
    <div className={`p-1 text-sm ${step.skipped ? "opacity-50" : ""}`}>
      {step.name && <div className="italic text-xs">{step.name}</div>}
      <div>
        {step.skipped ? <div>s</div> : null}
        {content}
      </div>
    </div>
  );
};
