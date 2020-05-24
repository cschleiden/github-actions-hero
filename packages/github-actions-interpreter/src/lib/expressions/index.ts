import { ILexingError, IRecognitionException } from "chevrotain";
import { evaluator, IExpressionContext, RuntimeContexts } from "./evaluator";
import { ExpressionLexer, parser } from "./parser";

export type { IExpressionContext, RuntimeContexts };

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

const expr = /\$\{\{(.*?)\}\}/gm;

export function parseExpression(expression: string) {
  const lexResult = ExpressionLexer.tokenize(expression);
  parser.input = lexResult.tokens;
  const cst = parser.expression();
  return cst;
}

/**
 * Evaluates a single expression with the given context
 *
 * @param expression Expression to evaluate, with or without ${{ }} marker
 * @param context Context for evaluation
 */
export function evaluateExpression(
  expression: string,
  context: IExpressionContext
) {
  // This expects a single expression in the form of "<expr>" or "${{ <expr> }}". Remove the
  // ${{ }} markers
  expression = expression.replace(expr, (_, g) => g);

  const lexResult = ExpressionLexer.tokenize(expression);

  // setting a new input will RESET the parser instance's state.
  parser.input = lexResult.tokens;

  // any top level rule may be used as an entry point
  const cst = parser.expression();

  const result = evaluator.visit(cst, context);

  if (lexResult.errors.length > 0 || parser.errors.length > 0) {
    throw new ExpressionError(lexResult.errors, parser.errors);
  }

  return result;
}

/**
 * Evaluates and replaces zero or more expressions in a string. Expressions must be surrounded with
 * ${{ <expr> }} and will be replaced with their evaluation result in the returned string.
 *
 * @param input String containing zero or more expression
 * @param context Context for evaluation
 */
export function replaceExpressions(
  input: string,
  context: IExpressionContext
): string {
  return input.replace(expr, (_, g) => {
    return evaluateExpression(g, context);
  });
}
