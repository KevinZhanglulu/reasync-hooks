# React Redux Async Hooks

A tool helps user keep track of async action states,that is based on [react-redux](https://react-redux.js.org/) and [react hooks](https://reactjs.org/docs/hooks-intro.html) and inspired by https://medium.com/stashaway-engineering/react-redux-tips-better-way-to-handle-loading-flags-in-your-reducers-afda42a804c6

## Table of Contents

- [Installation](#installation)
- [Example](#example)
  - [Basis example](#basis-example)
  - [Advanced example: fetch data](#advanced-example-fetch-data)
  
- [API](#api)
  - [`asyncActionCreator`](#asyncActionCreator)
  - [`asyncReduxMiddlewareCreator`](#asyncReduxMiddlewareCreator)
  - [`asyncStateReducer`](#asyncStateReducer)
  - [`useIsAsyncPendingSelector`](#useIsAsyncPendingSelector)
  - [`useOnAsyncFulfilled`](#useOnAsyncFulfilled)
  - [`useOnAsyncRejected`](#useOnAsyncRejected)
  - [`asyncErrorReducerCreator`](#asyncErrorReducerCreator)
  - [`asyncFulfilledActionTypeCreator`](#asyncFulfilledActionTypeCreator)

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

```tsx
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
    new Promise() <
    any >
    function(resolve, reject) {
      setTimeout(function() {
        reject("");
      }, 1000);
    }
);

const BasicExample = () => {
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
```

### Advanced example: fetch data

```tsx
const FULFILLED_ACTION = "FULFILLED_ACTION";
const REJECTED_ACTION = "REJECTED_ACTION";

const asyncFulfilledAction = asyncActionCreator(
  FULFILLED_ACTION,
  //Mock fetch data successfully
  () =>
    new Promise(function(resolve) {
      setTimeout(function() {
        //Receive data
        resolve({ profile: { email: "someone@email.com", username: "user" } });
      }, 1000);
    })
);

const asyncRejectedAction = asyncActionCreator(
  REJECTED_ACTION,
  //Mock an error occurs when fetch data
  () =>
    new Promise() <
    any >
    function(resolve, reject) {
      setTimeout(function() {
        //An error occurs
        reject({ error: { msg: "something wrong" } });
      }, 1000);
    }
);

const fulfilledHandler = (
  resolveValue: any,
  action: Action,
  dispatch: Dispatch
) => {
  //resolveValue:{profile: { email: "someone@email.com", username: "user" } };
  dispatch({ ...action, data: resolveValue });
};

const fulfilledReducer = (state = {}, action: any) => {
  if (action.type === asyncFulfilledActionTypeCreator(FULFILLED_ACTION)) {
    return {
      ...state,
      ...action.data
    };
  }
  return state;
};

//Store the error in redux state.error when error occurs
const rejectedHandler = (
  rejectedReason: any,
  action: Action,
  dispatch: Dispatch
) => {
  dispatch({
    ...action,
    error: rejectedReason.error
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

  //Notify something when async action changes from pending to fulfilled
  useOnAsyncFulfilled([FULFILLED_ACTION], () => {
    notifier.success(store.getState().user.profile.email);
  });

  //Notify something when async action is from pending to rejected
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
```

## API

### asyncActionCreator

#### Parameters

​	`actionType:string` : An async action type.

​	`asyncFunction:(getState)=>Promise`: A function that emits asynchronous operation.

​	`extraArgument?:any` : A custom argument that can be get by `action.extraArgument` in the async action workflow.

#### Return

​	`asyncAction:{types:[pendingType,fulfilledType,rejectedType],asyncFunction}`

The `reduxMiddleware` that is created by `asyncReduxMiddlewareCreator` will **only** response the `action` with a `types` property .In fact, the idea behind `react-redux-async-hooks` is that dispatch a corresponding actcion (pendingType, fulfilledType, rejectedType) when the **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** that `asyncFunction` returns is in a different state(pending,fulfilled,rejected).

**Note**: asyncFunction must be a function that return a **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)**.

### asyncReduxMiddlewareCreator

#### Parameters

​	`fullfilledHandler?:(resolveValue,action,dispatch,getState) => void`:If the promise has already fulfilled, this handler will be called.

​	`rejectedHandler?:( rejectedReason, action, dispatch, getState) => void`: If the promise has already rejected, this handler will be called.

**Note**: Default handlers only call `diapatch(action)`

#### Return

​	`void`

Customize your `asyncrReducMiddeware`.

### asyncStateReducer

A [reducer](https://redux.js.org/basics/reducers) that specifies how the application's state changes in response to async action to the store. This reducer will record the state(pending, fulfilled, rejected) that each async action is in.

### useIsAsyncPendingSelector

#### Parameters

​	`actionTypes:string[]`: A group of async action types that need keep track of.

#### Return

​	`isAsyncPending:boolen`: `Ture` means that **at least one** async action among `actionTypes` is in **pending** .`False` means that **all** async actions among `actionTypes` are in `fullfiled` or `rejected`

### useOnAsyncFulfilled

#### Parameters

​	`actionTypes:string[]`: A group of async action types that need keep track of.

​	`handler:(asyncType)=>void`: Run when any one of async actions that are represented by `actionTypes`

is form **pending** to **fulfilled**. The `asyncType` is passed to `handler` is the one that triggers the `handler`.

`	asyncStateReducerKey:string="asyncState"` :Under the hood, `useOnAsyncFulfilled` try to get the async action states by

```js
//https://react-redux.js.org/api/hooks#useselector
useSelector(state => state[asyncState]);
```

So you have to ensure `asyncStateReducerKey` same with the key that is passed to `combinReducer` for `asyncSateReducer` .

#### Return

​	`void`

### useOnAsyncRejected

#### Parameters

​	`actionTypes:string[]`: A group of async action types that need keep track of.

​	`handler:(actionType)=>void`: Run when any one of async actions that are represented by `actionTypes`

is form **pending** to **rejected**. The `actionType` is passed to `handler` is the one that triggers the `handler`.

​	`asyncStateReducerKey="asyncState"`: Same with this parameter in `useOnAsyncFulfilled`.

#### Return

​	`void`

### asyncErrorReducerCreator

#### Parameters

​	`originReducer:(state,action)=>state`: A reducer.

#### Return

​	`errorReducer:(state,action)=>state`: A wrapped `reducer` is almost a [reducer](https://redux.js.org/basics/reducers), except that it returns `originRducer(state,action)` when the `type` property in  `action` is `rejectedType`, or it returns the state that is passed.

### asyncFulfilledActionTypeCreator

#### Parameters

​	`actionType:string`: An action type that represented an async action.

#### Return

​	`asyncFulfilledType:string`: An async action type that you can use in your reducer to catch up the async action when it is fullfilled.

## License

[MIT]
