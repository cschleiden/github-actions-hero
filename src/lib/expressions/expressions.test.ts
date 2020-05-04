import { evaluateExpression } from ".";

const ev = <T>(input: string): T => evaluateExpression(input).result;

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
    [ ]	Index
    .	Property dereference
    !	Not
    */

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

  it("grouping", () => {
    expect(ev("(true && false) && true")).toBe(false);
    expect(ev("true && (false && true)")).toBe(false);

    expect(ev("(true || false) && true")).toBe(true);
    expect(ev("true || (false && true)")).toBe(true);
  });
});
