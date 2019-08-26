import React from "react";
import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import {
  fulfilledTypeCreator,
  rejectedTypeCreator,
  asyncReduxMiddlewareCreator,
  asyncStateReducer,
  useIsAsyncPendingSelector,
  useOnAsyncFulfilled,
  useOnAsyncRejected,
  asyncActionCreator
} from "react-redux-async-hooks";
import { Provider, useDispatch, useStore } from "react-redux";
import { Button, message } from "antd";
import("antd/dist/antd.css");
import("./App.css");

/*
Step 1: customize the redux  middleware
 */
const fulfilledHandler = (resolveValue, action, dispatch) => {
  dispatch({ ...action, data: resolveValue });
};
const rejectedHandler = (rejectedReason, action, dispatch) => {
  dispatch({
    ...action,
    error: rejectedReason
  });
};
const asyncReduxMiddleWare = asyncReduxMiddlewareCreator(
    fulfilledHandler,
    rejectedHandler
);

/*
Step 2: create async actions
*/
const FULFILLED_ACTION = "FULFILLED_ACTION";
const REJECTED_ACTION = "REJECTED_ACTION";
//Mock that fetch data successfully
const fetchDataSuccess = () =>
    new Promise(function(resolve) {
      setTimeout(function() {
        //Receive data
        resolve({ profile: { email: "someone@email.com" } });
      }, 1000);
    });
//Mock that an error occurs when fetch data
const fetchDataError = () =>
    new Promise(function(resolve, reject) {
      setTimeout(function() {
        //An error occurs
        reject({ msg: "something wrong" });
      }, 1000);
    });
const asyncFulfilledAction = asyncActionCreator(
    FULFILLED_ACTION,
    fetchDataSuccess
);
const asyncRejectedAction = asyncActionCreator(REJECTED_ACTION, fetchDataError);

/*
Step 3: create reducers
 */
const fulfilledReducer = (state = {}, action) => {
  if (action.type === fulfilledTypeCreator(FULFILLED_ACTION)) {
    return {
      ...state,
      ...action.data
    };
  }
  return state;
};
const errorReducer = (state = {}, action) => {
  switch (action.type) {
    case rejectedTypeCreator(FULFILLED_ACTION):
      return {
        ...state,
        [FULFILLED_ACTION]: action.error
      };
    case rejectedTypeCreator(REJECTED_ACTION):
      return {
        ...state,
        [FULFILLED_ACTION]: action.error
      };
    default:
      return state;
  }
};

/*
 Step 4: create store
 */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer = combineReducers({
  user: fulfilledReducer,
  error: errorReducer,
  asyncState: asyncStateReducer
});
export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(asyncReduxMiddleWare))
);

/*
Step 5: use hooks in your component
 */
const AdvancedExample = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const isFulfilledActionPending = useIsAsyncPendingSelector([
    FULFILLED_ACTION
  ]);
  const isRejectedActionPending = useIsAsyncPendingSelector([REJECTED_ACTION]);
  //Notify data when async action changes from pending to fulfilled
  useOnAsyncFulfilled([FULFILLED_ACTION], () => {
    message.success(store.getState().user.profile.email);
  });
  //Notify error message when async action is from pending to rejected
  useOnAsyncRejected([REJECTED_ACTION], asyncType => {
    message.error(store.getState().error[asyncType].msg);
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
Step 6: nest the component inside of a `<Provider>
 */
const App = () => (
    <Provider store={store}>
      <AdvancedExample />
    </Provider>
);
export default App;
