import Ajv from "ajv";
import { Workflow } from "../workflow";
export declare function parse(input: string): Workflow;
export declare class ParseError extends Error {
    errors: Ajv.ErrorObject[];
    constructor(errors: Ajv.ErrorObject[]);
}
