import React from "react";
import "./App.css";
import {
    Action,
    applyMiddleware,
    combineReducers,
    createStore,
    Dispatch
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import {
    asyncErrorReducerCreator,
    fulfilledTypeCreator,
    asyncReduxMiddlewareCreator,
    asyncStateReducer,
    useIsAsyncPendingSelector,
    useOnAsyncFulfilled,
    useOnAsyncRejected,
    asyncActionCreator
} from "react-redux-async-hooks";
import { Provider, useDispatch, useStore } from "react-redux";
import { Button } from "./conponent/Button/Button";
import { notifier } from "./conponent/Notification";
const composeEnhancers = composeWithDevTools({
    serialize: true
});

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

const fulfilledHandler = (
    resolveValue: any,
    action: Action,
    dispatch: Dispatch
) => {
    dispatch({ ...action, data: resolveValue });
};

const fulfilledReducer = (state = {}, action: any) => {
    if (action.type === fulfilledTypeCreator(FULFILLED_ACTION)) {
        return {
            ...state,
            ...action.data
        };
    }
    return state;
};

const rejectedHandler = (
    rejectedReason: any,
    action: Action,
    dispatch: Dispatch
) => {
    dispatch({
        ...action,
        error: rejectedReason
    });
};
const errorReducer = asyncErrorReducerCreator((state, action) => {
    return {
        ...state,
        [action.type]: action.error
    };
});

//Customize an asyncReduxMiddleware
const asyncReduxMiddleWare = asyncReduxMiddlewareCreator(
    fulfilledHandler,
    rejectedHandler
);

//Combine fulfilledReducer,errorReducer,asyncStateReducer
const rootReducer = combineReducers({
    user: fulfilledReducer,
    error: errorReducer,
    asyncState: asyncStateReducer
});

export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(asyncReduxMiddleWare))
);

const AdvancedExample = () => {
    const dispatch = useDispatch();

    const store = useStore();

    const isFulfilledActionPending = useIsAsyncPendingSelector([
        FULFILLED_ACTION
    ]);
    const isRejectedActionPending = useIsAsyncPendingSelector([REJECTED_ACTION]);

    //Notify data when async action changes from pending to fulfilled
    useOnAsyncFulfilled([FULFILLED_ACTION], () => {
        notifier.success(store.getState().user.profile.email);
    });

    //Notify error message when async action is from pending to rejected
    useOnAsyncRejected([REJECTED_ACTION], asyncType => {
        notifier.error(store.getState().error[asyncType].msg);
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
        <AdvancedExample />
    </Provider>
);

export default App;
