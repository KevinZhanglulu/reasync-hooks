# React Redux Async Hooks

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg) [![npm version](https://img.shields.io/npm/v/react-redux-async-hooks.svg?style=flat)](https://www.npmjs.com/package/react-redux-async-hooks) [![CircleCI](https://circleci.com/gh/KevinZhanglulu/react-redux-async-hooks.svg?style=svg)](https://circleci.com/gh/KevinZhanglulu/react-redux-async-hooks) 


A tool to keep track of redux async action states, based on [react-redux](https://react-redux.js.org/) and [react hooks](https://reactjs.org/docs/hooks-intro.html).

## Table of Contents

- [Installation](#installation)
- [Example](#example)
  - [Basis example](#basis-example)
  - [Advanced example: fetch data and handle error](#advanced-example-fetch-data-and-handle-error)
  
- [API](#api)
  - [`asyncActionCreator`](#asyncActionCreator)
  - [`asyncReduxMiddlewareCreator`](#asyncReduxMiddlewareCreator)
  - [`asyncStateReducer`](#asyncStateReducer)
  - [`useIsAsyncPendingSelector`](#useIsAsyncPendingSelector)
  - [`useOnAsyncFulfilled`](#useOnAsyncFulfilled)
  - [`useOnAsyncRejected`](#useOnAsyncRejected)
  - [`fulfilledTypeCreator`](#fulfilledTypeCreator)
  - [`rejectedTypeCreator`](#rejectedTypeCreator)

- [Todo](#todo)

## Installation

React Redux Async Hooks requires **React 16.8.3 and React-redux 7.10 or later.**

```
npm install --save react-redux-async-hooks
```

This assumes that you’re using [npm](http://npmjs.com/) package manager
with a module bundler like [Webpack](https://webpack.js.org/) or
[Browserify](http://browserify.org/) to consume [CommonJS
modules](https://webpack.js.org/api/module-methods/#commonjs).

## Example

### Basis example

You can play around with the following **example** in [this codesandbox](https://codesandbox.io/s/github/KevinZhanglulu/react-redux-async-hooks/tree/master/examples/basis):

#### **Step 1**

##### Create store

```js
import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import { asyncReduxMiddlewareCreator , asyncStateReducer } from "react-redux-async-hooks";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const asyncReduxMiddleware = asyncReduxMiddlewareCreator();
const rootReducer = combineReducers({
  asyncState: asyncStateReducer
});
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(asyncReduxMiddleware))
);
```

#### Step 2

##### Create async actions

```js
import { asyncActionCreator } from "react-redux-async-hooks";

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
```

#### Step 3

##### Use hooks in your component

```jsx
import {
  useIsAsyncPendingSelector,
  useOnAsyncFulfilled,
  useOnAsyncRejected
} from "react-redux-async-hooks";
import { useDispatch } from "react-redux";
import { Button, message } from "antd";

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
```

#### Step 4

##### Nest the component inside of a `<Provider>`

```jsx
import { Provider } from "react-redux";

const App = () => (
  <Provider store={store}>
    <BasisExample />
  </Provider>
);
export default App;
```

#### Complete example:

```jsx
import React from "react";
import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import {
  asyncReduxMiddlewareCreator,
  asyncStateReducer,
  useIsAsyncPendingSelector,
  useOnAsyncFulfilled,
  useOnAsyncRejected,
  asyncActionCreator
} from "react-redux-async-hooks";
import { Provider, useDispatch } from "react-redux";
import { Button, message } from "antd";
import("antd/dist/antd.css");
import ("./App.css");

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
```



### Advanced example: fetch data and handle error

There are two examples. One uses the react-redux-async-hooks, the other only uses hooks. Both examples implement the same goal that fetch data and, if successful, notify the data, otherwise notify the error message.

#### 1.Only use react hooks

**Note**: This example is only used to help users understand the usage of react-redux-async-hooks and is not recommended.

```jsx
import React, { useEffect, useState } from "react";
import {Button,message} from 'antd'

const ExampleOnlyUseHooks = () => {
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

  const [isFulfilledAsyncPending, setIsFulfilledAsyncPending] = useState(false);
  const [data, setSetData] = useState();

  const [isRejectedAsyncPending, setIsRejectedAsyncPending] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (data) message.success(data.profile.email);
  }, [data]);

  useEffect(() => {
    if (error) message.error(error.msg);
  }, [error]);

  return (
      <div className="App">
        <Button
            onClick={() => {
              setIsFulfilledAsyncPending(true);
              fetchDataSuccess().then(data => {
                setIsFulfilledAsyncPending(false);
                setSetData(data);
              });
            }}
            loading={isFulfilledAsyncPending}
            type='primary'
        >
          asyncFulfilledAction
        </Button>
        <Button
            onClick={() => {
              setIsRejectedAsyncPending(true);
              fetchDataError().catch(error => {
                setIsRejectedAsyncPending(false);
                setError(error);
              });
            }}
            loading={isRejectedAsyncPending}
            type='danger'
        >
          asyncRejectedAction
        </Button>
      </div>
  );
};
```

#### 2.Use react-redux-async-hooks

You can play around with the following **example** in [this codesandbox](https://codesandbox.io/s/github/KevinZhanglulu/react-redux-async-hooks/tree/master/examples/advanced):

#### Step 1

##### Customize the redux  middleware

```jsx
import { asyncReduxMiddlewareCreator , asyncStateReducer } from "react-redux-async-hooks";

const fulfilledHandler = (resolveValue, action, dispatch) => {
  dispatch({ ...action, data: resolveValue });
};
const rejectedHandler = (rejectedReason, action, dispatch) => {
  dispatch({
    ...action,
    error: rejectedReason
  });
};
const asyncReduxMiddleware = asyncReduxMiddlewareCreator(
  fulfilledHandler,
  rejectedHandler
);
```

#### Step 2

##### Create async actions

```js
import { asyncStateReducer, asyncActionCreator } from "react-redux-async-hooks";

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
```



#### Step 3

##### Create reducers

```js
import {
  fulfilledTypeCreator,
  rejectedTypeCreator
} from "react-redux-async-hooks";

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
  if (action.type === rejectedTypeCreator(REJECTED_ACTION))
    return {
      ...state,
      [REJECTED_ACTION]: action.error
    };
  return state;
};
```

#### Step 4

##### Create store

```js
import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import { asyncReduxMiddlewareCreator , asyncStateReducer } from "react-redux-async-hooks";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer = combineReducers({
  user: fulfilledReducer,
  error: errorReducer,
  asyncState: asyncStateReducer
});
export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(asyncReduxMiddleware))
);
```

#### Step 5

##### Use hooks in your component

```jsx
import {
  useIsAsyncPendingSelector,
  useOnAsyncFulfilled,
  useOnAsyncRejected
} from "react-redux-async-hooks";
import { useDispatch, useStore } from "react-redux";
import { Button, message } from "antd";

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
```

#### Step 6

##### Nest the component inside of a `<Provider>`

```jsx
import { Provider } from "react-redux";

const App = () => (
  <Provider store={store}>
    <AdvancedExample />
  </Provider>
);
export default App;
```

#### complete example:

```jsx
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
const asyncReduxMiddleware = asyncReduxMiddlewareCreator(
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
  if (action.type === rejectedTypeCreator(REJECTED_ACTION))
    return {
      ...state,
      [REJECTED_ACTION]: action.error
    };
  return state;
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
    composeEnhancers(applyMiddleware(asyncReduxMiddleware))
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
        </Butto
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
```



## API

### asyncActionCreator

```js
const asyncAction = () => actionTypeCreator(type, asyncAction, extraArgument)
```

#### Parameters

​	`actionType:string` : An async action type.

​	`asyncFunction:(getState)=>Promise`: A function that executes an asynchronous operation.

​	`extraArgument?:any` : A custom argument that will be available  by `action.extraArgument` in the async action workflow.

#### Return

​	`asyncAction:{types:[pendingType,fulfilledType,rejectedType],asyncFunction,extraArgument}`

The `reduxMiddleware` that is created by `asyncReduxMiddlewareCreator` will **only** response the `action` with a `types` property . In fact, the idea behind `react-redux-async-hooks` is that dispatch a corresponding action(pendingType, fulfilledType, rejectedType) when the **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** that `asyncFunction` returns is in a different state(pending,fulfilled,rejected).

**Note**: `asyncFunction` must be a function that returns a **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)**.



### asyncReduxMiddlewareCreator

```js
const asyncReduxMiddleware = asyncReduxMiddleware(fullfilledHandler, rejectedHandler)
```

#### Parameters

​	`fullfilledHandler?:(resolveValue, action, dispatch, getState) => void`: If the promise has already been fulfilled, this handler will be called.

​	`rejectedHandler?:( rejectedReason, action, dispatch, getState) => void`: If the promise has already been rejected, this handler will be called.

**Note**: Default handlers only call `diapatch(action)`.

#### Return

​	`void`

Customize your `asyncrReduxMiddeware`.



### asyncStateReducer

A [reducer](https://redux.js.org/basics/reducers) that specifies how the application's state changes in response to async action to the store.



### useIsAsyncPendingSelector

```js
const isPending = useIsAsyncPendingSelector(actionTypes, asyncStateReducerKey)
```

#### Parameters

​	`actionTypes:string[]`: A group of async actions that are kept track of.

​	`asyncStateReducerKey:string="asyncState"` : Under the hood, `useIsAsyncPendingSelector` tries to get async action states by

```js
//https://react-redux.js.org/api/hooks#useselector
useSelector(state => state[asyncStateReducerKey]);
```

**So you have to ensure `asyncStateReducerKey` same with the key that is passed to `combinReducers` for `asyncSateReducer` .**

#### Return

​	`isAsyncPending:boolen`: `True` means that **at least one** among `asyncTypes` is in **pending** .  `False` means that **all** in `asyncTypes` are in `fulfilled` or `rejected`.



### useOnAsyncFulfilled

```js
useOnAsyncFulfilled(actionTypes, handler, asyncStateReducerKey)
```

#### Parameters

​	`actionTypes:string[]`: A group of async actions that are kept track of.

​	`handler:(asyncType)=>void`: Run when any one of  `actionTypes` changes from **pending** to **fulfilled**. The `asyncType` is passed to `handler` is the one that triggers the `handler`.

​	`asyncStateReducerKey:string="asyncState"` : Same with this parameter in `useIsAsyncPendingSelector`.

#### Return

​	`void`



### useOnAsyncRejected

```js
useOnAsyncRejected(actionTypes, handler, asyncStateReducerKey)
```

#### Parameters

​	`actionTypes:string[]`: A group of async action types that are kept track of.

​	`handler:(actionType)=>void`: Run when one of  `actionTypes `changes from **pending** to **rejected**. The `actionType` is passed to `handler` is the one that triggers the `handler`.

​	`asyncStateReducerKey="asyncState"`: Same with this parameter in `useIsAsyncPendingSelector`.

#### Return

​	`void`



### fulfilledTypeCreator

```js
const fulfilledType = fulfilledTypeCreator(actionType)
```

#### Parameters

​	`actionType:string`: An action type that represents an async action.

#### Return

​	`asyncFulfilledType:string`: An async action type that you can use in your **reducers** to catch up the async action when it is in **fulfilled**.



### rejectedTypeCreator

```js
const rejectedType = rejectedTypeCreator(actionType)
```

#### Parameters

​	`actionType:string`: An action type that represents an async action.

#### Return

​	`asyncFulfilledType:string`: An async action type that you can use in your **reducers** to catch up the async action when it is in **rejected**.

### Todo

- [x] Add test

## License

[MIT]
