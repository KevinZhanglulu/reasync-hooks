import { AnyAction, Dispatch, Middleware } from "./utils/reduxTypes";
import { asyncActionTypeCreator, isPromise } from "./utils/helpers";

export type AsyncHandler = (
  valueOrReason: any, //resolved value or rejected reason
  action: AnyAction,
  dispatch: Dispatch,
  getState: () => any
) => void;

const defaultHandler: AsyncHandler = (value, action, dispatch) =>
  dispatch(action);

export const asyncReduxMiddlewareCreator = (config: {
  fulfilledHandler?: AsyncHandler;
  rejectedHandler?: AsyncHandler;
}): Middleware => ({ getState, dispatch }) => {
  return next => action => {
    const { type, asyncFunction, ...extraArgument } = action;
    if (!asyncFunction || !isPromise(asyncFunction)) return next(action);
    const {
      fulfilledHandler = defaultHandler,
      rejectedHandler = defaultHandler
    } = config;
    const actionType = asyncActionTypeCreator(type);
    dispatch({
      type: actionType.pending
    });

    if (process.env.NODE_ENV !== "production") {
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
    }
    return asyncFunction(getState)
      .then((resolvedValue: any) =>
        fulfilledHandler(
          resolvedValue,
          { ...extraArgument, type: actionType.fulfilled },
          dispatch,
          getState
        )
      )
      .catch((rejectedReason: any) =>
        rejectedHandler(
          rejectedReason,
          { ...extraArgument, type: actionType.rejected },
          dispatch,
          getState
        )
      );
  };
};
