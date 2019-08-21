import { useCallback } from "react";
import { useSelector } from "react-redux";
import { PENDING } from "../constant";

export const createPendingSelector = (actionTypes: string[]) => (state: any) =>
  actionTypes.some(actionTypes => {
    if (state.asyncState) return state.asyncState[actionTypes] === PENDING;
    return false;
  });

// Return false only when all async action states are in pending or fulfilled
export const useIsAsyncPendingSelector = (actionTypes: string[]) => {
  const pendingSelector = useCallback(createPendingSelector(actionTypes), []);
  return useSelector<any, boolean>(state => pendingSelector(state));
};
