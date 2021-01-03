import * as React from "react";
import { Event, RuntimeModel } from "../lib/runtimeModel";
export declare const WorkflowExecution: React.FC<{
    id: number;
    events: Event[];
    executionModel: RuntimeModel;
}>;
