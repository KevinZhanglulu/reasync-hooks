import { useEffect, useReducer, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";

export const useAsyncStateSelector = (
  actionTypes: string[],
  asyncStateType: string,
  asyncStateReducerKey: string
) => {
  const [, forceRender] = useReducer(s => s + 1, 0);
  const currentAsyncStates = useRef<(string | undefined)[]>();

  const asyncAction = useRef<{ type: string | null }>({
    type: null
  });

  const asyncStateSelector = (state: any) => {
    return actionTypes.map(actionName => {
      if (!state[asyncStateReducerKey])
        throw new Error(
          `You may not pass {${asyncStateReducerKey}:asyncStateReducer} to combineReducers()`
        );
      return state[asyncStateReducerKey][actionName];
    });
  };

  const nextStates = useSelector<any, (string | undefined)[]>(
    state => asyncStateSelector(state),
    shallowEqual
  );

  useEffect(() => {
    if (!currentAsyncStates.current) currentAsyncStates.current = nextStates;
    const length = currentAsyncStates.current.length;
    for (let i = 0; i < length; i++) {
      if (nextStates[i] && currentAsyncStates.current[i] !== nextStates[i]) {
        currentAsyncStates.current = nextStates;
        if (nextStates[i] === asyncStateType) {
          asyncAction.current = { type: actionTypes[i] };
          forceRender({});
        }
      }
    }
  }, [nextStates]);

  return asyncAction.current;
};
