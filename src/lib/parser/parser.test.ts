import { parse, ParseError } from "./parser";

describe("Successful parsing of workflow", () => {
  it("basic with name", () => {
    const wf = parse(`name: test
on: push
jobs:
  first:
    runs-on: ubuntu-latest
    steps:
    - run: echo 1`);

    expect(wf.name).toBe("test");
    expect(wf.on).toBe("push");
  });

  it("with on array", () => {
    const wf = parse(
      `name: test
on: [push, pull_request]
jobs:
  first:
    runs-on: ubuntu-latest
    steps:
    - run: echo 1`
    );

    expect(wf.name).toBe("test");
    expect(wf.on).toEqual(["push", "pull_request"]);
  });

  it("with on object", () => {
    const wf = parse(
      `name: test
on:
  push:
  pull_request:
jobs:
  first:
    runs-on: ubuntu-latest
    steps:
    - run: echo 1`
    );

    expect(wf.name).toBe("test");
    expect(wf.on).toEqual({ push: null, pull_request: null });
  });

  it("with if expression", () => {
    const wf = parse(
      `name: test
on: [push]
jobs:
  first:
    runs-on: ubuntu-latest
    if: \${{ env.TEST }}
    steps:
    - run: echo 1`
    );

    expect(wf.name).toBe("test");
    expect(wf.on).toEqual(["push"]);
  });
});

describe("Parser errors", () => {
  it("syntax error in on", () => {
    checkParseError(`on: asf:`, 0, 7);
  });

  it("requires jobs", () => {
    checkGeneralParseError(
      `on: push`,
      "Validation failed: data should have required property 'jobs'"
    );
  });
});

function checkGeneralParseError(workflow: string, msg?: string) {
  try {
    parse(workflow);
    fail("Did not throw");
  } catch (e) {
    expect(e instanceof ParseError).toBeTruthy();
    if (!!msg) {
      expect(e.message).toBe(msg);
    }
  }
}

function checkParseError(workflow: string, line: number, column: number) {
  try {
    parse(workflow);
    fail("Did not throw");
  } catch (e) {
    expect(e.mark?.line).toBe(line);
    expect(e.mark?.column).toBe(column);
  }
}
