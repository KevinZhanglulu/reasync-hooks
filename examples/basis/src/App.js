import "antd/dist/antd.css";
import "./App.css";
import React from "react";
import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import {
  asyncReduxMiddlewareCreator,
  asyncStateReducer,
  useIsAsyncPendingSelector,
  useOnAsyncFulfilled,
  useOnAsyncRejected,
  asyncActionCreator
} from "reasync-hooks";
import { Provider, useDispatch } from "react-redux";
import { Button, message } from "antd";

/*
Step 1: create store
 */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const asyncReduxMiddleware = asyncReduxMiddlewareCreator();
const rootReducer = combineReducers({
  asyncState: asyncStateReducer
});
const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(asyncReduxMiddleware))
);

/*
Step 2: create async actions
 */
const FULFILLED_ACTION = "FULFILLED_ACTION";
const REJECTED_ACTION = "REJECTED_ACTION";
const asyncFulfilledAction = asyncActionCreator(
    FULFILLED_ACTION,
    //Return a fulfilled Promise
    () =>
        new Promise(function(resolve) {
          setTimeout(function() {
            resolve("");
          }, 1000);
        })
);
const asyncRejectedAction = asyncActionCreator(
    REJECTED_ACTION,
    //Return a rejected Promise
    () =>
        new Promise(function(resolve, reject) {
          setTimeout(function() {
            reject("");
          }, 1000);
        })
);

/*
Step 3: use hooks in your component
 */
const BasisExample = () => {
  const dispatch = useDispatch();
  const isFulfilledActionPending = useIsAsyncPendingSelector([
    FULFILLED_ACTION
  ]);
  const isRejectedActionPending = useIsAsyncPendingSelector([REJECTED_ACTION]);
  //Notify something when async action is from pending to fulfilled
  useOnAsyncFulfilled([FULFILLED_ACTION], asyncType => {
    message.success(asyncType);
  });
  //Notify something when async action is from pending to rejected
  useOnAsyncRejected([REJECTED_ACTION], asyncType => {
    message.error(asyncType);
  });
  return (
      <div className="App">
        <Button
            onClick={() => dispatch(asyncFulfilledAction)}
            loading={isFulfilledActionPending}
            type="primary"
        >
          asyncFulfilledAction
        </Button>
        <Button
            onClick={() => dispatch(asyncRejectedAction)}
            loading={isRejectedActionPending}
            type="danger"
        >
          asyncRejectedAction
        </Button>
      </div>
  );
};

/*
Step4: nest the component inside of a `<Provider>`
 */
const App = () => (
    <Provider store={store}>
      <BasisExample />
    </Provider>
);
export default App;
