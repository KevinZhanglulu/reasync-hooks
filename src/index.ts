import { asyncFulfilledActionTypeCreator } from "./asyncActionTypeCreators";
import { useIsAsyncPendingSelector } from "./hooks/useIsAsyncPedningSelector";
import { asyncStateReducer } from "./reducers/asyncStateReducer";
import { asyncErrorReducerCreator } from "./reducers/asyncErrorReducerCreator";
import { asyncReduxMiddlewareCreator } from "./asyncReduxMiddlewareCreator";
import { onAsyncStateHookCreator } from "./hooks/onAsyncStateHookCreator";
import { asyncActionCreator } from "./asyncActionCreator";
import { FULFILLED, REJECTED } from "./constant";

const useOnAsyncFulfilled = onAsyncStateHookCreator(FULFILLED);
const useOnAsyncRejected = onAsyncStateHookCreator(REJECTED);

export {
  asyncErrorReducerCreator,
  asyncStateReducer,
  asyncFulfilledActionTypeCreator,
  useIsAsyncPendingSelector,
  useOnAsyncFulfilled,
  useOnAsyncRejected,
  asyncReduxMiddlewareCreator,
  asyncActionCreator
};
