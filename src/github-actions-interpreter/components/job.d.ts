import * as React from "react";
import { RuntimeJob } from "../lib/runtimeModel";
export declare const Job: React.FC<{
    className?: string;
    workflowVisId: number;
    job: RuntimeJob;
    connectable?: boolean;
}>;
