import React from "react";
import { applyMiddleware, combineReducers, createStore ,compose} from "redux";
import {
  asyncReduxMiddlewareCreator,
  asyncStateReducer,
  useIsAsyncPendingSelector,
  useOnAsyncFulfilled,
  useOnAsyncRejected,
  asyncActionCreator
} from "react-redux-async-hooks";
import { Provider, useDispatch } from "react-redux";
import { Button,message } from "antd";
import("antd/dist/antd.css");
import ("./App.css");

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//Create default asyncReduxMiddleware
const asyncReduxMiddleWare = asyncReduxMiddlewareCreator();

//Add asyncStateReducer to rootReducer
const rootReducer = combineReducers({
  asyncState: asyncStateReducer
});

export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(asyncReduxMiddleWare))
);

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

const AsyncExample = () => {
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
            type='primary'
        >
          asyncFulfilledAction
        </Button>
        <Button
            onClick={() => dispatch(asyncRejectedAction)}
            loading={isRejectedActionPending}
            type='danger'
        >
          asyncRejectedAction
        </Button>
      </div>
  );
};

const App = () => (
    <Provider store={store}>
      <AsyncExample />
    </Provider>
);

export default App;
