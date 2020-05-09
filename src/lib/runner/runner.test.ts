import { RuntimeRunStep, RuntimeUsesStep, StepType } from "../runtimeModel";
import { run } from "./runner";

describe("Runner", () => {
  it("with name", () => {
    const r = run({ event: "push" }, ".github/workflows/lesson.yaml", {
      name: "Lesson",
      on: "push",
      jobs: {},
    });

    expect(r.name).toBe("Lesson");
  });

  it("without name", () => {
    const r = run({ event: "push" }, ".github/workflows/lesson.yaml", {
      on: "push",
      jobs: {},
    });

    expect(r.name).toBe(".github/workflows/lesson.yaml");
  });

  it("without matching trigger", () => {
    const r = run({ event: "push" }, ".github/workflows/lesson.yaml", {
      on: [],
      jobs: {},
    });

    expect(r.jobs.length).toBe(0);
  });

  it("with matching trigger", () => {
    const r = run({ event: "push" }, ".github/workflows/lesson.yaml", {
      on: "push",
      jobs: {
        first: {
          "runs-on": "ubuntu-latest",
          steps: [
            {
              run: "echo 'Success'",
            },
          ],
        },
      },
    });

    expect(r.jobs.length).toBe(1);
    expect(r.jobs[0].name).toBe("first");
  });

  it("with expression name", () => {
    const r = run({ event: "push" }, ".github/workflows/lesson.yaml", {
      on: "push",
      jobs: {
        first: {
          name: "${{ github.event_name }}",
          "runs-on": "ubuntu-latest",
          steps: [
            {
              run: "echo 'Success'",
            },
          ],
        },
      },
    });

    expect(r.jobs.length).toBe(1);
    expect(r.jobs[0].name).toBe("push");
  });

  it("runs multiple jobs in random order", () => {
    const r = run({ event: "push" }, ".github/workflows/lesson.yaml", {
      on: "push",
      jobs: {
        first: {
          "runs-on": "ubuntu-latest",
          steps: [
            {
              run: "echo 'Success'",
            },
          ],
        },
        second: {
          "runs-on": "ubuntu-latest",
          steps: [
            {
              run: "echo 'Success'",
            },
          ],
        },
      },
    });

    expect(r.jobs.length).toBe(2);
    expect(r.jobs[0].name).toBe("first");
    expect(r.jobs[1].name).toBe("second");
  });

  it("runs multiple jobs in specified order", () => {
    const r = run({ event: "push" }, ".github/workflows/lesson.yaml", {
      on: "push",
      jobs: {
        second: {
          "runs-on": "ubuntu-latest",
          needs: "first",
          steps: [
            {
              run: "echo 'Success'",
            },
          ],
        },
        third: {
          "runs-on": "ubuntu-latest",
          steps: [
            {
              run: "echo 'Success'",
            },
          ],
          needs: ["first", "second"],
        },
        first: {
          "runs-on": "ubuntu-latest",
          steps: [
            {
              run: "echo 'Success'",
            },
          ],
        },
      },
    });

    expect(r.jobs.map((j) => j.name)).toEqual(["first", "second", "third"]);
    expect(r.jobs.map((j) => j.level)).toEqual([0, 1, 2]);
  });

  it("runs steps", () => {
    const r = run({ event: "push" }, ".github/workflows/lesson.yaml", {
      on: "push",
      jobs: {
        first: {
          "runs-on": "ubuntu-latest",
          steps: [
            {
              run: "echo 'Success'",
            },
            {
              uses: "actions/checkout@v2",
            },
          ],
        },
      },
    });

    expect(r.jobs[0].steps.length).toBe(2);
    expect(r.jobs[0].steps[0]).toEqual<RuntimeRunStep>({
      stepType: StepType.Run,
      run: "echo 'Success'",
    });
    expect(r.jobs[0].steps[1]).toEqual<RuntimeUsesStep>({
      stepType: StepType.Uses,
      uses: "actions/checkout@v2",
    });
  });
});

// describe("expressions", () => {
//   it("constant values", () => {
//     expect(_evaluateExpression("${{ false }}", {})).toBe(false);
//     expect(_evaluateExpression("${{ true }}", {})).toBe(true);

//     expect(_evaluateExpression("${{ 123 }}", {})).toBe(123);
//   });
// });
