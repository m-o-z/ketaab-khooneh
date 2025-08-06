export const wrapExpressionInParenthesis = (expression: string) => {
  return ["(", expression, ")"].join(" ");
};

export const createExpression = (
  cond: boolean,
  expressions: string[],
  joinWith: " && " | " || " = " && ",
) => {
  if (cond) {
    return [wrapExpressionInParenthesis(expressions.join(joinWith))];
  }
  return [];
};
