import * as chevrotain from "chevrotain";
const True = chevrotain.createToken({ name: "True", pattern: /true/ });
const False = chevrotain.createToken({ name: "False", pattern: /false/ });
const Null = chevrotain.createToken({ name: "Null", pattern: /null/ });
const Function = chevrotain.createToken({
  name: "Function",
  pattern: /toJson|hashFiles/,
});
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
export const And = chevrotain.createToken({
  name: "And",
  pattern: /&&/,
  categories: Operator,
});
export const Or = chevrotain.createToken({
  name: "Or",
  pattern: /\|\|/,
  categories: Operator,
});
export const Eq = chevrotain.createToken({
  name: "Eq",
  pattern: /==/,
  categories: Operator,
});
export const NEq = chevrotain.createToken({
  name: "NotEq",
  pattern: /!=/,
  categories: Operator,
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
    ]);
  });

  logicalGrouping = this.RULE("logicalGrouping", () => {
    this.CONSUME(LParens);
    this.SUBRULE(this.expression);
    this.CONSUME(RParens);
  });

  functionCall = this.RULE("functionCall", () => {
    this.CONSUME(Function);
    this.CONSUME(LParens);
    this.SUBRULE(this.parameters);
    this.CONSUME(RParens);
  });

  parameters = this.RULE("parameters", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => {
        this.SUBRULE(this.expression);
      },
    });
  });

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
