import { Reducer } from "redux";

export const asyncReducerCreator = (
  suffixes: string[],
  delimiter = "_"
): Reducer => (state = {}, action) => {
  const { type } = action;

  const rePattern = `(.*)${delimiter}(${suffixes.join("|")})`;

  const re = new RegExp(rePattern);

  const matches = re.exec(type);

  if (!matches) return state;

  const [, actionType, asyncState] = matches;
  return {
    ...state,
    [actionType]: asyncState
  };
};
