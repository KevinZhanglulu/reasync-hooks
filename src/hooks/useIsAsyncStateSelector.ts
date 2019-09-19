import { useMemo } from "react";
import { AsyncState } from "./useAsyncStateSelector";

// Return false only when all async action states are in rejected or fulfilled
export const useIsAsyncStateSelector = (
  actionTypes: string[],
  config: {
    type: string;
    asyncState: AsyncState;
  }
) => {
  const { type, asyncState } = config;
  const actionTypesMemo = useMemo(() => actionTypes, [...actionTypes]);
  return useMemo(
    () => actionTypesMemo.some(actionType => asyncState[actionType] === type),
    [actionTypesMemo, asyncState, type]
  );
};
