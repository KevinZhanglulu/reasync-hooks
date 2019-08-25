import { FULFILLED, PENDING, REJECTED } from "./utils/constant";
import { Reducer } from "./utils/reduxTypes";

export const asyncStateReducer: Reducer = (state = {}, action) => {
  const { type } = action;

  const re = new RegExp(`(.*)_(${PENDING}|${REJECTED}|${FULFILLED})`);

  const matches = re.exec(type);

  if (!matches) return state;

  const [, actionType, asyncState] = matches;
  return {
    ...state,
    [actionType]: asyncState
  };
};
