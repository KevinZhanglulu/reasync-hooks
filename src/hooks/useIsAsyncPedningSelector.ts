import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { config } from "../config/";

// Return false only when all async action states are in rejected or fulfilled
export const useIsAsyncPendingSelector = (actionTypes: string[]) => {
  // TODO: need a better way to avoid re-render
  const actionTypesMemo = useMemo(() => actionTypes, [...actionTypes]);

  const pendingSelector = useCallback(
    (state: any) => {
      if (process.env.NODE_ENV !== "production")
        if (!state.hasOwnProperty(config.asyncStateReducerKey))
          throw new Error(
            `You may not pass {${config.asyncStateReducerKey}:asyncStateReducer} to combineReducers()`
          );
      return actionTypesMemo.some(actionType => {
        if (state.hasOwnProperty(config.asyncStateReducerKey))
          return (
            state[config.asyncStateReducerKey][actionType] ===
            config.suffix.pending
          );
        return false;
      });
    },
    [actionTypesMemo]
  );

  return useSelector<any, boolean>(pendingSelector);
};
