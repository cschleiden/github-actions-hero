import { evaluator, IExpressionContext } from "./evaluator";
import { ExpressionLexer, parser } from "./parser";

export function evaluateExpression(
  expression: string,
  context: IExpressionContext
) {
  const lexResult = ExpressionLexer.tokenize(expression);
  // setting a new input will RESET the parser instance's state.
  parser.input = lexResult.tokens;
  // any top level rule may be used as an entry point
  const cst = parser.expression();

  const result = evaluator.visit(cst, context);

  return {
    result: result,
    lexErrors: lexResult.errors,
    parseErrors: parser.errors,
  };
}
