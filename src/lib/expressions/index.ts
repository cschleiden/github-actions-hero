import { ILexingError, IRecognitionException } from "chevrotain";
import { evaluator, IExpressionContext } from "./evaluator";
import { ExpressionLexer, parser } from "./parser";

export class ExpressionError extends Error {
  constructor(
    public lexErrors: ILexingError[],
    public parseErrors: IRecognitionException[]
  ) {
    super(
      `${lexErrors.map((x) => x.message).join()} ${parseErrors
        .map((x) => x.message)
        .join()}`
    );
  }
}

export function evaluateExpression(
  expression: string,
  context: IExpressionContext
) {
  expression = expression.replace(/\$\{\{(.*?)\}\}/gm, (_, g) => g);

  const lexResult = ExpressionLexer.tokenize(expression);

  // setting a new input will RESET the parser instance's state.
  parser.input = lexResult.tokens;

  // any top level rule may be used as an entry point
  const cst = parser.expression();

  const result = evaluator.visit(cst, context);
  console.log(expression, result);

  if (lexResult.errors.length > 0 || parser.errors.length > 0) {
    throw new ExpressionError(lexResult.errors, parser.errors);
  }

  return result;
}

const expr = /\$\{\{(.*?)\}\}/gm;

export function replaceExpressions(
  input: string,
  context: IExpressionContext
): string {
  return input.replace(expr, (_, g) => {
    return evaluateExpression(g, context);
  });
}
