import React from "react";
import "./App.css";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import {
    asyncReduxMiddlewareCreator,
    asyncStateReducer,
    useIsAsyncPendingSelector,
    useOnAsyncFulfilled,
    useOnAsyncRejected
} from "react-redux-async-hooks";
import { Provider, useDispatch } from "react-redux";
import { asyncActionCreator } from "react-redux-async-hooks";
import { Button } from "./conponent/Button/Button";
import { notifier } from "./conponent/Notification";
const composeEnhancers = composeWithDevTools({
    serialize: true
});

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

const BasisExample = () => {
    const dispatch = useDispatch();

    const isFulfilledActionPending = useIsAsyncPendingSelector([
        FULFILLED_ACTION
    ]);
    const isRejectedActionPending = useIsAsyncPendingSelector([REJECTED_ACTION]);

    //Notify something when async action is from pending to fulfilled
    useOnAsyncFulfilled([FULFILLED_ACTION], asyncType => {
        notifier.success(asyncType);
    });

    //Notify something when async action is from pending to rejected
    useOnAsyncRejected([REJECTED_ACTION], asyncType => {
        notifier.error(asyncType);
    });

    return (
        <div className="App">
            <Button
                onClick={() => dispatch(asyncFulfilledAction)}
                isLoading={isFulfilledActionPending}
                isPrimary={true}
            >
                asyncFulfilledAction
            </Button>
            <Button
                onClick={() => dispatch(asyncRejectedAction)}
                isLoading={isRejectedActionPending}
                isPrimary={true}
            >
                asyncRejectedAction
            </Button>
        </div>
    );
};

const App = () => (
    <Provider store={store}>
        <BasisExample />
    </Provider>
);

export default App;
