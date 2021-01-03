import * as React from "react";
import { RuntimeJob } from "../lib/runtimeModel";
export declare const MatrixJob: React.FC<{
    workflowVisId: number;
    connectorId: string;
    title: string;
    jobs: RuntimeJob[];
}>;
