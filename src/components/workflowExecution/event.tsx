import { BranchName } from "@primer/components";
import Octicon, { GitBranch } from "@primer/octicons-react";
import * as React from "react";
import { Event } from "../../lib/runtimeModel";
import { makeSafeForCSS } from "./utils";

export const WorkflowEvent: React.FC<{ id: number; event: Event }> = ({
  id,
  event,
}) => {
  return (
    <div
      className="border border-gray-500 rounded bg-gray-500 shadow relative p-3 text-center"
      style={{ width: "240px" }}
    >
      <div className="font-bold">{event.event}</div>
      {(() => {
        const annotations: JSX.Element[] = [];

        if ("action" in event) {
          annotations.push(
            <div key="action">
              <BranchName>{event.action}</BranchName>
            </div>
          );
        }

        if ("branch" in event) {
          annotations.push(
            <div key="branch">
              <Octicon icon={GitBranch} className="mr-1" />
              <BranchName>{event.branch}</BranchName>
            </div>
          );
        }

        return annotations;
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
            event.event
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
  );
};
