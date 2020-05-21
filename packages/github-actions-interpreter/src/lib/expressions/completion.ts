import { tokenMatcher } from "chevrotain";
import { IExpressionContext } from "./evaluator";
import {
  Context,
  ContextMember,
  defaultRule,
  Dot,
  ExpressionLexer,
  parser,
} from "./parser";

export function doComplete(input: string, context: IExpressionContext): any[] {
  const lexResult = ExpressionLexer.tokenize(input);
  if (lexResult.errors.length > 0) {
    throw new Error("sad sad panda, lexing errors detected");
  }
  const partialTokenVector = lexResult.tokens;
  if (!partialTokenVector || partialTokenVector.length === 0) {
    // Nothing to suggest
    return [];
  }

  // console.log(partialTokenVector);

  const lastInputToken = partialTokenVector[partialTokenVector.length - 1];
  if (
    tokenMatcher(lastInputToken, ContextMember) ||
    (tokenMatcher(lastInputToken, Dot) &&
      tokenMatcher(partialTokenVector[partialTokenVector.length - 2], Context))
  ) {
    // Determine previous context
    const searchTerm = tokenMatcher(lastInputToken, Dot)
      ? ""
      : lastInputToken.image;

    const contextToken = tokenMatcher(lastInputToken, Dot)
      ? partialTokenVector[partialTokenVector.length - 2]
      : partialTokenVector[partialTokenVector.length - 3];
    if (
      tokenMatcher(contextToken, Context) &&
      context.contexts[contextToken.image]
    ) {
      const properties = Object.keys(context.contexts[contextToken.image]);
      return properties.filter(
        (x) =>
          searchTerm === "" || (x.startsWith(searchTerm) && x !== searchTerm)
      );
    }
  }

  console.log(partialTokenVector);

  const syntacticSuggestions = parser.computeContentAssist(
    defaultRule,
    partialTokenVector
  );

  console.log(syntacticSuggestions);

  const tokenTypesSuggestions = syntacticSuggestions.map(
    (suggestion) => suggestion.nextTokenType
  );

  console.log(tokenTypesSuggestions);

  // Transform token type suggestions?
  return tokenTypesSuggestions.map((x) => {
    if (x.name === "ContextMember") {
    }
  });

  return tokenTypesSuggestions;
}

function provideEnvCompletion(input: string, context: IExpressionContext) {}
