import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { PENDING } from "../utils/constant";

// Return false only when all async action states are in rejected or fulfilled
export const useIsAsyncPendingSelector = (
  actionTypes: string[],
  asyncStateReducerKey = "asyncState"
) => {
  // TODO: need a better way to avoid re-render
  const actionTypesMemo = useMemo(() => actionTypes, [...actionTypes]);

  const pendingSelector = useCallback(
    (state: any) => {
      if (!state.hasOwnProperty(asyncStateReducerKey))
        throw new Error(
          `You may not pass {${asyncStateReducerKey}:asyncStateReducer} to combineReducers()`
        );
      return actionTypesMemo.some(actionType => {
        if (state.hasOwnProperty(asyncStateReducerKey))
          return state[asyncStateReducerKey][actionType] === PENDING;
        return false;
      });
    },
    [actionTypesMemo, asyncStateReducerKey]
  );

  return useSelector<any, boolean>(pendingSelector);
};
