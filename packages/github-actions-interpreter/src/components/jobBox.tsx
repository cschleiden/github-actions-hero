import * as React from "react";
import { ConnectorPoints } from "./connectors";

export const JobBox: React.FC<{
  workflowVisId: number;

  header: JSX.Element;
  headerClassname?: string;

  content: JSX.Element;

  connectorId?: string;
}> = ({ workflowVisId, connectorId, content, header, headerClassname }) => {
  return (
    <div
      className={`flex-0 border border-gray-500 rounded bg-white shadow relative m-3 last:mr-0 ${
        (!!headerClassname && headerClassname) || ""
      }`}
    >
      {connectorId && (
        <ConnectorPoints
          workflowVisId={workflowVisId}
          connectorId={connectorId}
        />
      )}

      <div className="flex flex-row bg-gray-200 rounded rounded-b-none ">
        {header}
      </div>
      <div className="p-2">{content}</div>
    </div>
  );
};
