import { useRef } from "react";
import { useSelector } from "react-redux";

type ActionState = undefined | string;

export const useAsyncStateSelector = (
  actionTypes: string[],
  asyncStateType: string,
  asyncStateReducerKey: string
) => {
  const asyncAction = useRef<{ type: string | null }>({
    type: null
  });

  const asyncStateSelector = (state: any) => {
    return actionTypes.map(actionType => {
      if (!state[asyncStateReducerKey])
        throw new Error(
          `You may not pass {${asyncStateReducerKey}:asyncStateReducer} to combineReducers()`
        );
      return state[asyncStateReducerKey][actionType];
    });
  };

  const equalityFn = (
    newStates: ActionState[],
    currentStates: ActionState[]
  ) => {
    for (let i = 0; i < currentStates.length; i++) {
      if (currentStates[i] !== newStates[i]) {
        currentStates[i] = newStates[i];
        if (newStates[i] === asyncStateType) {
          asyncAction.current = { type: actionTypes[i] };
          //Re-render
          return false;
        }
      }
    }
    return true;
  };

  useSelector<any, ActionState[]>(
    state => asyncStateSelector(state),
    //The useSelector calls equalityFn in the useEffect on the server or useLayoutEffect on the browser.(https://github.com/reduxjs/react-redux/blob/0c5f7646f600e635e1caf62863ad61350011f3e7/src/hooks/useSelector.js#L71)
    equalityFn
  );

  return asyncAction.current;
};
