import Ajv from "ajv";
import { JSON_SCHEMA, safeLoad } from "js-yaml";
import schema from "../../schemas/schema.json";
import { Workflow } from "./workflow";

const ajv = new Ajv({
  extendRefs: true,
});
const validator = ajv.compile(schema);

export function parse(input: string): Workflow {
  const workflow = safeLoad(input, {
    // onWarning(this, e)
    schema: JSON_SCHEMA,
  }) as Workflow;

  const valid = validator(workflow);
  if (!valid) {
    throw new ParseError(validator.errors);
  }

  return workflow;
}

export class ParseError extends Error {
  constructor(public errors: Ajv.ErrorObject[]) {
    // Trying to show the most specific validation error first, take the one with
    // the longest schema path.
    super(
      ajv.errorsText(
        errors
          .sort((a, b) => a.schemaPath.length - b.schemaPath.length)
          .slice(-1)
      )
    );
  }
}
