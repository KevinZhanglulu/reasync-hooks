import { FULFILLED, PENDING, REJECTED } from "../constant";
import { Reducer } from "../reduxTypes";

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
