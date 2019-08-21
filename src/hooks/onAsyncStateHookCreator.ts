import { useAsyncStateSelector } from "./useAsyncStateSelctor";
import { useEffect } from "react";

export const onAsyncStateHookCreator = (asyncStateType: string) => (
  actionTypes: string[],
  handler: (asyncType: string) => void,
  asyncStateReducerKey = "asyncState"
) => {
  /*
  Under the hood,the return value of useAsyncStateSelector is the .current property of an ref object that will be persisted for the full lifetime of the component.
  And the return value is a same("oldValue===newValue" is true) object between re-renders,
  unless any one of async action states that are represented by actionTypes changes from pending to fulfilled,
  in which the return value is a new("oldValue===newValue" is false) object.
  Note: the return value is initialized to "{actionType:null}".
  */
  const asyncAction = useAsyncStateSelector(
    actionTypes,
    asyncStateType,
    asyncStateReducerKey
  );

  /*
  The useEffect use "===" to compare the action Type between re-renders(https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects).
  */
  useEffect(() => {
    if (asyncAction.type) handler(asyncAction.type);
  }, [asyncAction]);
};
