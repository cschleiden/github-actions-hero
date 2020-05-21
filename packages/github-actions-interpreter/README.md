# github-actions-interpreter

Tests are co-located.

- `lib/workflow.ts` - Workflow typing
- `lib/parser` - `js-yaml` and `ajv` based workflow YAML parser and validator
- `lib/expressions` - GitHub Actions Expression parser and interpreter as well as helper for providing auto-complete
- `lib/runner` - Transforms a parsed workflow into an approximated execution model. Uses expression parser/interpreter.
- `lib/runtimeModel` - Runtime model