import { applyMiddleware, combineReducers, createStore, Reducer } from "redux";
import * as rtl from "@testing-library/react";
import {
  asyncActionCreator,
  asyncReduxMiddlewareCreator,
  asyncStateReducer,
  fulfilledTypeCreator,
  useOnAsyncFulfilled
} from "../../src";
import { act, renderHook } from "@testing-library/react-hooks";
import { Provider, useStore } from "react-redux";
import * as React from "react";
import { AsyncHandler } from "../../src/asyncReduxMiddlewareCreator";
import {
  pendingTypeCreator,
  rejectedTypeCreator
} from "../../src/actions/asyncActionTypeCreators";

describe("React", () => {
  describe("hooks", () => {
    describe("useOnAsyncFulfilled", () => {
      let renderedItems: string[] = [];
      const actionType = "ASYNC_ACTION";

      beforeEach(() => {
        renderedItems = [];
      });

      afterEach(() => rtl.cleanup());

      it("should call handler when the async action state changes from pending ro fulfilled ", async function() {
        const store = createStore(
          combineReducers({
            asyncState: asyncStateReducer
          }),
          applyMiddleware(asyncReduxMiddlewareCreator())
        );
        renderHook(
          () => {
            useOnAsyncFulfilled([actionType], asyncType => {
              renderedItems.push(asyncType);
            });
          },
          { wrapper: props => <Provider store={store} {...props} /> }
        );
        await act(() =>
          store.dispatch<any>(
            asyncActionCreator(
              actionType,
              () =>
                new Promise(function(resolve) {
                  resolve("");
                })
            )
          )
        );
        expect(renderedItems).toEqual([actionType]);
      });

      it("should get resolve value", async function() {
        const fulfilledHandler: AsyncHandler = (
          resolveValue,
          action,
          dispatch
        ) => {
          return dispatch({ ...action, data: resolveValue });
        };
        const reduxMiddleware = asyncReduxMiddlewareCreator(fulfilledHandler);

        const resolveReducer: Reducer = (state = {}, action) => {
          if (action.type === fulfilledTypeCreator(actionType))
            return { ...state, data: action.data };
          return state;
        };

        const store = createStore(
          combineReducers({
            asyncState: asyncStateReducer,
            resolve: resolveReducer
          }),
          applyMiddleware(reduxMiddleware)
        );

        renderHook(
          () => {
            const store = useStore();
            useOnAsyncFulfilled([actionType], () => {
              renderedItems.push(store.getState().resolve.data);
            });
          },
          { wrapper: props => <Provider store={store} {...props} /> }
        );

        await act(() =>
          store.dispatch<any>(
            asyncActionCreator(
              actionType,
              () =>
                new Promise(function(resolve) {
                  resolve("data");
                })
            )
          )
        );
        expect(renderedItems).toEqual(["data"]);
      });

      it("should not call the handler in other conditions", async function() {
        let count = 0;
        const store = createStore(
          combineReducers({
            asyncState: asyncStateReducer
          }),
          applyMiddleware(asyncReduxMiddlewareCreator())
        );
        renderHook(
          () => {
            useOnAsyncFulfilled([actionType], () => {
              count = count + 1;
            });
          },
          { wrapper: props => <Provider store={store} {...props} /> }
        );
        await act(() =>
          store.dispatch<any>(
            asyncActionCreator(
              actionType,
              () =>
                new Promise(function(resolve) {
                  resolve("");
                })
            )
          )
        );
        expect(count).toEqual(1);

        await act(async () => {
          store.dispatch({ type: pendingTypeCreator(actionType) });
        });
        expect(count).toEqual(1);

        await act(async () => {
          store.dispatch({ type: rejectedTypeCreator(actionType) });
        });
        expect(count).toEqual(1);

        await act(async () => {
          store.dispatch({ type: pendingTypeCreator(actionType) });
        });
        expect(count).toEqual(1);
      });
      it("should throw error when asyncStateReducerKey is not same as with the key for asyncReducer in combineReducers", function() {
        const store = createStore(
          combineReducers({
            asyncState: asyncStateReducer
          }),
          applyMiddleware(asyncReduxMiddlewareCreator())
        );
        const { result } = renderHook(
          () => useOnAsyncFulfilled([actionType], () => {}, "wrongReducerKey"),
          { wrapper: props => <Provider store={store} {...props} /> }
        );
        expect(result.error).toBeInstanceOf(Error);
      });
    });
  });
});
