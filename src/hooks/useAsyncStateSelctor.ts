import { useCallback, useMemo, useRef } from "react";
import { useSelector } from "react-redux";

type ActionState = { [key: string]: string };

export const useAsyncStateSelector = (
  actionTypes: string[],
  asyncStateType: string,
  asyncStateReducerKey: string
) => {
  const asyncAction = useRef<{ type: string | null }>({
    type: null
  });

  const actionTypesMemo = useMemo(() => actionTypes, [...actionTypes]);

  const asyncStateSelector = useCallback(
    (state: any) => {
      if (!state[asyncStateReducerKey])
        throw new Error(
          `You may not pass {${asyncStateReducerKey}:asyncStateReducer} to combineReducers()`
        );
      let asyncState = {};
      actionTypesMemo.forEach(actionType => {
        asyncState = {
          ...asyncState,
          [actionType]: state[asyncStateReducerKey][actionType]
        };
      });
      return asyncState;
    },
    [actionTypesMemo, asyncStateReducerKey]
  );

  const equalityFn = useCallback(
    (newState: ActionState, currentState: ActionState) => {
      actionTypesMemo.forEach(actionType => {
        if (currentState[actionType] !== newState[actionType]) {
          //Avoid bugs when actionTypesMemo is changed
          const preState = currentState[actionType];
          currentState[actionType] = newState[actionType];
          if (preState && newState[actionType] === asyncStateType) {
            asyncAction.current = { type: actionType };
            //Re-render
            return false;
          }
        }
      });
      return true;
    },
    [actionTypesMemo, asyncStateType]
  );

  useSelector<any, ActionState>(
    asyncStateSelector,
    //The useSelector calls equalityFn in the useEffect on the server or useLayoutEffect on the browser.(https://github.com/reduxjs/react-redux/blob/0c5f7646f600e635e1caf62863ad61350011f3e7/src/hooks/useSelector.js#L71)
    equalityFn
  );

  return asyncAction.current;
};
