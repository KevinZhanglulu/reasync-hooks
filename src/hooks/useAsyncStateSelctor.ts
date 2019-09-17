import { useCallback, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { config } from "../config";

type ActionState = { [key: string]: string };

export const useAsyncStateSelector = (
  actionTypes: string[],
  asyncStateType: string
) => {
  const asyncAction = useRef<{ type: string | null }>({
    type: null
  });
  //TODO: need a better way to avoid re-render
  const actionTypesMemo = useMemo(() => actionTypes, [...actionTypes]);

  const asyncStateSelector = useCallback(
    (state: any) => {
      console.log(config);
      if (process.env.NODE_ENV !== "production")
        if (!state.hasOwnProperty(config.asyncStateReducerKey))
          throw new Error(
            `You may not pass {${config.asyncStateReducerKey}:asyncStateReducer} to combineReducers()`
          );
      let asyncState = {};
      actionTypesMemo.forEach(actionType => {
        asyncState = {
          ...asyncState,
          [actionType]: state[config.asyncStateReducerKey][actionType]
        };
      });
      return asyncState;
    },
    [actionTypesMemo, config.asyncStateReducerKey]
  );

  const equalityFn = useCallback(
    (newState: ActionState, currentState: ActionState) => {
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

  useSelector<any, ActionState>(
    asyncStateSelector,
    /*
    The useSelector calls equalityFn in the useEffect on the server or useLayoutEffect on the browser,
    which is why the .current property of a ref object can be changed in equalityFn.(https://github.com/reduxjs/react-redux/blob/0c5f7646f600e635e1caf62863ad61350011f3e7/src/hooks/useSelector.js#L71)
    */
    equalityFn
  );

  return asyncAction.current;
};
