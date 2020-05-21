import { doComplete } from "./completion";
import { IExpressionContext } from "./evaluator";

const testContext: IExpressionContext = {
  contexts: {
    env: {
      FOO: 42,
      BAR_TEST: "hello",
    },
    secrets: {
      AWS_TOKEN: "12",
    },
  },
} as any;

describe("auto-complete", () => {
  describe("for contexts", () => {
    it("provides suggestions for env", () => {
      expect(doComplete("env.X", testContext)).toEqual([]);
      expect(doComplete("1 == env.F", testContext)).toEqual(["FOO"]);
      expect(doComplete("env.", testContext)).toEqual(["FOO", "BAR_TEST"]);
      expect(doComplete("env.FOO", testContext)).toEqual([]);
    });

    it("provides suggestions for secrets", () => {
      expect(doComplete("secrets.A", testContext)).toEqual(["AWS_TOKEN"]);
      expect(doComplete("1 == secrets.F", testContext)).toEqual([]);
      expect(doComplete("toJson(secrets.", testContext)).toEqual(["AWS_TOKEN"]);
    });
  });

  // describe("for functions", () => {
  //   it("toJson", () => {
  //     expect(doComplete("toJ", testContext)).toEqual(["toJson"]);
  //   });
  // });
});
