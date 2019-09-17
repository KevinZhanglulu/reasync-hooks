import { AnyAction, Dispatch, Middleware } from "./utils/reduxTypes";
import { asyncActionTypeCreator, isPromise } from "./utils/helpers";
import { setConfig } from "./index";
import { config } from "./config";

export type AsyncHandler = (
  valueOrReason: any, //resolved value or rejected reason
  action: AnyAction,
  dispatch: Dispatch,
  getState: () => any
) => void;

const defaultHandler: AsyncHandler = (value, action, dispatch) =>
  dispatch(action);

export const asyncReduxMiddlewareCreator = (
  configuration: {
    fulfilledHandler?: AsyncHandler;
    rejectedHandler?: AsyncHandler;
    asyncStateReducerKey?: string;
    suffix?: { pending?: string; fulfilled?: string; rejected?: string };
  } = {}
): Middleware => ({ getState, dispatch }) => {
  return next => action => {
    const { type, asyncFunction, ...payload } = action;
    if (typeof asyncFunction !== "function") return next(action);
    const promise = asyncFunction(getState);

    if (process.env.NODE_ENV !== "production") {
      if (!isPromise(promise))
        throw new Error(
          "Expected the return of asyncFunction to be a Promise."
        );
    }

    const {
      fulfilledHandler = defaultHandler,
      rejectedHandler = defaultHandler,
      asyncStateReducerKey,
      suffix
    } = configuration;
    if (
      asyncStateReducerKey &&
      config.asyncStateReducerKey !== asyncStateReducerKey
    )
      setConfig({ asyncStateReducerKey });
    if (suffix) setConfig({ suffix });

    const actionType = asyncActionTypeCreator(type);
    next({
      type: actionType.pending
    });

    if (process.env.NODE_ENV !== "production") {
      if (typeof fulfilledHandler !== "function") {
        throw new Error("Expected the fulfilledHandler to be a function.");
      }
      if (typeof rejectedHandler !== "function") {
        throw new Error("Expected the rejectedHandler to be a function.");
      }
    }
    return promise
      .then((resolvedValue: any) =>
        fulfilledHandler(
          resolvedValue,
          { ...payload, type: actionType.fulfilled },
          dispatch,
          getState
        )
      )
      .catch((rejectedReason: any) =>
        rejectedHandler(
          rejectedReason,
          { ...payload, type: actionType.rejected },
          dispatch,
          getState
        )
      );
  };
};
