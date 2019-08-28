import { AnyAction, Dispatch, Middleware } from "./utils/reduxTypes";

export type AsyncHandler = (
  valueOrReason: any, //resolved value or rejected reason
  action: AnyAction,
  dispatch: Dispatch,
  getState: () => any
) => void;

const defaultHandler: AsyncHandler = (value, action, dispatch) =>
  dispatch(action);

export const asyncReduxMiddlewareCreator = (
  fulfilledHandler: AsyncHandler = defaultHandler,
  rejectedHandler: AsyncHandler = defaultHandler
): Middleware => ({ getState, dispatch }) => {
  return next => action => {
    const { types, asyncFunction, ...extraArgument } = action;
    if (!types) return next(action);
    const [pendingType, fulfilledType, rejectedType] = types;
    dispatch({
      type: pendingType
    });
    if (typeof fulfilledHandler !== "function") {
      throw new Error("Expected the fulfilledHandler to be a function.");
    }
    if (typeof rejectedHandler !== "function") {
      throw new Error("Expected the rejectedHandler to be a function.");
    }
    if (typeof asyncFunction !== "function") {
      throw new Error(
        "Expected the asyncFunction to be a function that returns a Promise."
      );
    }
    return asyncFunction(getState)
      .then((resolvedValue: any) =>
        fulfilledHandler(
          resolvedValue,
          { ...extraArgument, type: fulfilledType },
          dispatch,
          getState
        )
      )
      .catch((rejectedReason: any) =>
        rejectedHandler(
          rejectedReason,
          { ...extraArgument, type: rejectedType },
          dispatch,
          getState
        )
      );
  };
};
