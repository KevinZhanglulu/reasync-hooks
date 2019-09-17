import { Reducer } from "./utils/reduxTypes";
import { config } from "./config/";

export const asyncStateReducer: Reducer = (state = {}, action) => {
  const { type } = action;
  const {
    fulfilled: FULFILLED,
    pending: PENDING,
    rejected: REJECTED
  } = config.suffix;

  const re = new RegExp(`(.*)_(${PENDING}|${REJECTED}|${FULFILLED})`);

  const matches = re.exec(type);

  if (!matches) return state;

  const [, actionType, asyncState] = matches;
  return {
    ...state,
    [actionType]: asyncState
  };
};
