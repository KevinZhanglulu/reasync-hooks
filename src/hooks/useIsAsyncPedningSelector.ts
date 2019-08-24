import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { PENDING } from "../utils/constant";

// Return false only when all async action states are in rejected or fulfilled
export const useIsAsyncPendingSelector = (
  actionTypes: string[],
  asyncStateReducerKey = "asyncState"
) => {
  const actionTypesMemo = useMemo(() => actionTypes, [...actionTypes]);

  const pendingSelector = useCallback(
    (state: any) =>
      actionTypesMemo.some(actionType => {
        if (state[asyncStateReducerKey])
          return state.asyncState[actionType] === PENDING;
        return false;
      }),
    [actionTypesMemo, asyncStateReducerKey]
  );

  return useSelector<any, boolean>(pendingSelector);
};
