import * as chevrotain from "chevrotain";

const True = chevrotain.createToken({ name: "True", pattern: /true/ });
const False = chevrotain.createToken({ name: "False", pattern: /false/ });
const Null = chevrotain.createToken({ name: "Null", pattern: /null/ });
const LParens = chevrotain.createToken({ name: "LParens", pattern: /\(/ });
const RParens = chevrotain.createToken({ name: "RParens", pattern: /\)/ });
const LSquare = chevrotain.createToken({ name: "LSquare", pattern: /\[/ });
const RSquare = chevrotain.createToken({ name: "RSquare", pattern: /]/ });
const Comma = chevrotain.createToken({ name: "Comma", pattern: /,/ });

//
// Operators
//
const Operator = chevrotain.createToken({
  name: "Operator",
  pattern: chevrotain.Lexer.NA,
});
const And = chevrotain.createToken({
  name: "And",
  pattern: /&&/,
  categories: Operator,
});
const Or = chevrotain.createToken({
  name: "Or",
  pattern: /\|\|/,
  categories: Operator,
});
const Eq = chevrotain.createToken({
  name: "Eq",
  pattern: /==/,
  categories: Operator,
});
const NEq = chevrotain.createToken({
  name: "NotEq",
  pattern: /!=/,
  categories: Operator,
});
const LT = chevrotain.createToken({
  name: "LT",
  pattern: /</,
  categories: Operator,
});
const LTE = chevrotain.createToken({
  name: "LTE",
  pattern: /<=/,
  categories: Operator,
});
const GT = chevrotain.createToken({
  name: "GT",
  pattern: />/,
  categories: Operator,
});
const GTE = chevrotain.createToken({
  name: "GTE",
  pattern: />=/,
  categories: Operator,
});

//
// Functions
//
const Function = chevrotain.createToken({
  name: "Function",
  pattern: chevrotain.Lexer.NA,
});
const contains = chevrotain.createToken({
  name: "contains",
  pattern: /contains/,
  categories: Function,
});

const StringLiteral = chevrotain.createToken({
  name: "StringLiteral",
  //pattern: /'(:?[^'']|\\(:?[bfnrtv\\/]|u[0-9a-fA-F]{4}))*'/,
  pattern: /'((?:''|[^'])*)'/,
});
const NumberLiteral = chevrotain.createToken({
  name: "NumberLiteral",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
});
const WhiteSpace = chevrotain.createToken({
  name: "WhiteSpace",
  pattern: /[ \t\n\r]+/,
  group: chevrotain.Lexer.SKIPPED,
});

const allTokens = [
  WhiteSpace,
  NumberLiteral,

  Function,
  contains,

  StringLiteral,
  LParens,
  RParens,
  LSquare,
  RSquare,
  Comma,

  Operator,
  And,
  Or,
  Eq,
  NEq,
  LTE,
  LT,
  GTE,
  GT,

  True,
  False,
  Null,
];
export const ExpressionLexer = new chevrotain.Lexer(allTokens);

class ExpressionParser extends chevrotain.CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  expression = this.RULE("expression", () => {
    this.OPTION(() => {
      this.SUBRULE(this.subExpression, { LABEL: "lhs" });
      this.MANY(() => {
        this.CONSUME(Operator);
        this.SUBRULE2(this.subExpression, { LABEL: "rhs" });
      });
    });
  });

  subExpression = this.RULE("subExpression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.logicalGrouping) },
      { ALT: () => this.SUBRULE(this.functionCall) },
      { ALT: () => this.SUBRULE(this.value) },
      { ALT: () => this.SUBRULE(this.array) },
    ]);
  });

  array = this.RULE("array", () => {
    this.CONSUME(LSquare);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => {
        this.SUBRULE(this.subExpression);
      },
    });
    this.CONSUME(RSquare);
  });

  logicalGrouping = this.RULE("logicalGrouping", () => {
    this.CONSUME(LParens);
    this.SUBRULE(this.expression);
    this.CONSUME(RParens);
  });

  functionCall = this.RULE("functionCall", () => {
    this.CONSUME(Function);
    this.CONSUME(LParens);
    //this.SUBRULE(this.parameters);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => {
        this.SUBRULE(this.expression);
      },
    });
    this.CONSUME(RParens);
  });

  // parameters = this.RULE("parameters", () => {

  // });

  value = this.RULE("value", () => {
    this.OR([
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.CONSUME(True) },
      { ALT: () => this.CONSUME(False) },
      { ALT: () => this.CONSUME(Null) },
    ]);
  });
}

// reuse the same parser instance.
export const parser = new ExpressionParser();

export const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

// Operators
export { And, Or, Eq, NEq, LT, LTE, GT, GTE };
// Functions
export { contains };
