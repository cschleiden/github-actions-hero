# GitHub Actions Hero

## FAQ

### Is this an official GitHub project?

No, it's a side-project I've been tinkering with.

### How does it work? Does it support all features of GitHub Actions?

No, this just emulates the workflow execution. Many features are supported, but not everything. And nothing is executed.

The tutorial has limited support for `echo` and outputting environment variables, but you cannot run actual commands.

## Structure

### Logic

Tests are co-located.

- `lib/workflow.ts` - Workflow typing
- `lib/parser` - `js-yaml` and `ajv` based workflow YAML parser and validator
- `lib/expressions` - GitHub Actions Expression parser and interpreter
- `lib/runner` - Transforms a parsed workflow into an approximated execution model. Uses expression parser/interpreter.
- `lib/runtimeModel.ts` - Runtime model