import { evaluateExpression, replaceExpressions } from ".";

const ctx = {
  contexts: {
    github: {
      event: {
        ref: "refs/tags/simple-tag",
      },
      secrets: {
        FOO: "Bar",
      },
    },
  },
};
const ev = <T>(input: string): T => evaluateExpression(input, ctx).result;

describe("expression parser", () => {
  it("numbers", () => {
    expect(ev("1")).toBe(1);
    expect(ev("2")).toBe(2);

    expect(ev("-2.0")).toBe(-2.0);
    expect(ev("-10.5")).toBe(-10.5);
  });

  it("strings", () => {
    expect(ev("'a'")).toBe("a");
    expect(ev("'abc'")).toBe("abc");
    expect(ev("'It''s open source!'")).toBe("It's open source!");
  });

  it("boolean", () => {
    expect(ev("true")).toBe(true);
    expect(ev("false")).toBe(false);
  });

  it("array", () => {
    expect(ev("[]")).toStrictEqual([]);
    expect(ev("[1,2,3]")).toStrictEqual([1, 2, 3]);
    expect(ev("['a', 'b']")).toStrictEqual(["a", "b"]);
    expect(ev("['a', 1]")).toStrictEqual(["a", 1]);
  });

  describe("operators", () => {
    /*
    !	Not
    */

    it("!", () => {
      // Booleans
      expect(ev("!true")).toBe(false);
      expect(ev("!false")).toBe(true);
    });

    it("==", () => {
      // Numbers
      expect(ev("1 == 2")).toBe(false);
      expect(ev("1 == 1")).toBe(true);

      // Strings
      expect(ev("'1' == '2'")).toBe(false);
      expect(ev("'ab' == 'ab'")).toBe(true);

      // Booleans
      expect(ev("true == true")).toBe(true);
      expect(ev("true == false")).toBe(false);
      expect(ev("false == true")).toBe(false);
      expect(ev("false == false")).toBe(true);

      // Mixed
      expect(ev("null == 0")).toBe(true);
      expect(ev("0 == null")).toBe(true);

      // Array
      expect(ev("[1,2] == [1.2]")).toBe(false);
    });

    it("!=", () => {
      // Numbers
      expect(ev("1 != 2")).toBe(true);
      expect(ev("1 != 1")).toBe(false);

      // Strings
      expect(ev("'1' != '2'")).toBe(true);
      expect(ev("'ab' != 'ab'")).toBe(false);

      // Booleans
      expect(ev("true != true")).toBe(false);
      expect(ev("true != false")).toBe(true);
      expect(ev("false != true")).toBe(true);
      expect(ev("false != false")).toBe(false);

      // Mixed
      expect(ev("null != 0")).toBe(false);
      expect(ev("0 != null")).toBe(false);

      // Array
      expect(ev("[1,2] != [1.2]")).toBe(true);
    });

    it("&&", () => {
      expect(ev("true && false")).toBe(false);
      expect(ev("false && true")).toBe(false);
      expect(ev("true && true")).toBe(true);
      expect(ev("false && false")).toBe(false);
    });

    it("||", () => {
      expect(ev("true || false")).toBe(true);
      expect(ev("false || true")).toBe(true);
      expect(ev("true || true")).toBe(true);
      expect(ev("false || false")).toBe(false);
    });

    it("<", () => {
      expect(ev("1 < 2")).toBe(true);
      expect(ev("1 < 1")).toBe(false);
      expect(ev("2 < 1")).toBe(false);
    });

    it("<=", () => {
      expect(ev("1 <= 2")).toBe(true);
      expect(ev("1 <= 1")).toBe(true);
      expect(ev("2 <= 1")).toBe(false);
    });

    it(">", () => {
      expect(ev("1 > 2")).toBe(false);
      expect(ev("1 > 1")).toBe(false);
      expect(ev("2 > 1")).toBe(true);
    });

    it(">=", () => {
      expect(ev("1 >= 2")).toBe(false);
      expect(ev("1 >= 1")).toBe(true);
      expect(ev("2 >= 1")).toBe(true);
    });
  });

  it("logical grouping", () => {
    expect(ev("(true && false) && true")).toBe(false);
    expect(ev("true && (false && true)")).toBe(false);

    expect(ev("(true || false) && true")).toBe(true);
    expect(ev("true || (false && true)")).toBe(true);
  });

  describe("functions", () => {
    describe("contains", () => {
      it("array", () => {
        expect(ev("contains([2, 1], 1)")).toBe(true);
      });

      it("string", () => {
        expect(ev("contains('hay', 'h')")).toBe(true);
        expect(ev("contains('tay', 'h')")).toBe(false);
      });
    });

    it("startsWith", () => {
      expect(ev("startsWith('Hello world', 'He')")).toBe(true);
      expect(ev("startsWith('Hello world', 'Het')")).toBe(false);
    });

    it("endsWith", () => {
      expect(ev("endsWith('Hello world', 'world')")).toBe(true);
      expect(ev("endsWith('Hello world', 'Het')")).toBe(false);
    });

    it("join", () => {
      expect(ev("join([1,2,3])")).toBe("1,2,3");
      expect(ev("join([1,2,3], '')")).toBe("123");
      expect(ev("join([1,'2'], '')")).toBe("12");
    });

    it("toJson", () => {
      expect(ev("toJson([1,2,3])")).toBe("[1,2,3]");
      expect(ev("toJson(github.event_path)")).toBe('"push.json"');
      expect(ev("toJson(secrets)")).toBe('{"FOO":"Bar"}');

      expect(ev("toJson(true)")).toBe("true");
      expect(ev("toJson(false)")).toBe("false");
    });
  });

  describe("context", () => {
    it("simple access", () => {
      expect(ev("github.event_path")).toBe("push.json");
      expect(ev("github['event_path']")).toBe("push.json");
    });
    it("nested access", () => {
      expect(ev("github.event['ref']")).toBe("refs/tags/simple-tag");
      expect(ev("github.event.ref")).toBe("refs/tags/simple-tag");
      expect(ev("github['event']['ref']")).toBe("refs/tags/simple-tag");
    });
  });
});

describe("expression replacer", () => {
  it("", () => {
    expect(replaceExpressions("abc", ctx)).toBe("abc");
    expect(replaceExpressions("abc ${{ 'test' }}", ctx)).toBe("abc test");
    expect(replaceExpressions("${{ 123 }} abc ${{ 'test' }}", ctx)).toBe(
      "123 abc test"
    );
  });
});
