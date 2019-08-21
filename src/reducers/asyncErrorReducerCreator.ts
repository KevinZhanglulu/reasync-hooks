import { REJECTED } from "../utils/constant";
import { Reducer } from "../utils/reduxTypes";

export const asyncErrorReducerCreator = (originReducer: Reducer): Reducer => (
  state = {},
  action
) => {
  const { type } = action;

  const re = new RegExp(`(.*)_(${REJECTED})`);
  const matches = re.exec(type);

  if (!matches) return state;

  const [, actionType] = matches;

  return originReducer(state, { ...action, type: actionType });
};
