import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

export type AsyncState = { [key: string]: string };

export const useAsyncStateSelector = (
  actionTypes: string[],
  asyncStateType: string,
  asyncState: AsyncState
) => {
  const asyncAction = useRef<{ type: string | null }>({
    type: null
  });
  //TODO: need a better way to avoid re-render
  const actionTypesMemo = useMemo(() => actionTypes, [...actionTypes]);
  const latestSelectedState = useRef<AsyncState>();

  const [, forceRender] = useReducer(s => s + 1, 0);

  const equalityFn = useCallback(
    (newState: AsyncState, currentState: AsyncState) => {
      for (let i = 0; i < actionTypesMemo.length; i++)
        if (currentState[actionTypesMemo[i]] !== newState[actionTypesMemo[i]]) {
          //Avoid bugs when actionTypesMemo is changed
          const preState = currentState[actionTypesMemo[i]];
          currentState[actionTypesMemo[i]] = newState[actionTypesMemo[i]];
          if (preState && newState[actionTypesMemo[i]] === asyncStateType) {
            asyncAction.current = { type: actionTypesMemo[i] };
            //Re-render
            return false;
          }
        }
      return true;
    },
    [actionTypesMemo, asyncStateType]
  );

  useEffect(() => {
    let newSelectedState = {};
    actionTypesMemo.forEach(actionType => {
      newSelectedState = {
        ...asyncState,
        [actionType]: asyncState[actionType]
      };
      if (
        latestSelectedState.current &&
        !equalityFn(newSelectedState, latestSelectedState.current)
      )
        forceRender({});
    });
  }, [actionTypesMemo, asyncState, equalityFn]);

  return asyncAction.current;
};
