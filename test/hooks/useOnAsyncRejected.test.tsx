import * as rtl from "@testing-library/react";
import { applyMiddleware, combineReducers, createStore, Reducer } from "redux";
import {
  asyncReduxMiddlewareCreator,
  asyncStateReducer,
  useOnAsyncRejected
} from "../../src";
import { act, renderHook } from "@testing-library/react-hooks";
import { Provider, useStore } from "react-redux";
import { AsyncHandler } from "../../src/asyncReduxMiddlewareCreator";

import * as React from "react";
import {
  fulfilledTypeCreator,
  pendingTypeCreator,
  rejectedTypeCreator
} from "../utils";

describe("React", () => {
  describe("hooks", () => {
    describe("useOnAsyncRejected", () => {
      let renderedItems: string[] = [];
      const actionType = "ASYNC_ACTION";

      beforeEach(() => {
        renderedItems = [];
      });

      afterEach(() => rtl.cleanup());

      it("should call handler when the async action state changes from pending ro rejected ", async function() {
        const store = createStore(
          combineReducers({
            asyncState: asyncStateReducer
          }),
          applyMiddleware(asyncReduxMiddlewareCreator())
        );
        renderHook(
          () => {
            useOnAsyncRejected([actionType], asyncType => {
              renderedItems.push(asyncType);
            });
          },
          { wrapper: props => <Provider store={store} {...props} /> }
        );
        await act(async () => {
          store.dispatch({
            type: actionType,
            asyncFunction: () =>
              new Promise(function(resolve, reject) {
                reject("");
              })
          });
        });
        expect(renderedItems).toEqual([actionType]);
      });

      it("should get rejected reason", async function() {
        const rejectedHandler: AsyncHandler = (
          rejectedReason,
          action,
          dispatch
        ) => {
          return dispatch({ ...action, error: rejectedReason });
        };
        const reduxMiddleware = asyncReduxMiddlewareCreator({
          rejectedHandler
        });

        const errorReducer: Reducer = (state = {}, action) => {
          if (action.type === rejectedTypeCreator(actionType))
            return { ...state, [actionType]: action.error };
          return state;
        };

        const store = createStore(
          combineReducers({
            asyncState: asyncStateReducer,
            error: errorReducer
          }),
          applyMiddleware(reduxMiddleware)
        );

        renderHook(
          () => {
            const store = useStore();
            useOnAsyncRejected([actionType], () => {
              renderedItems.push(store.getState().error[actionType]);
            });
          },
          { wrapper: props => <Provider store={store} {...props} /> }
        );

        await act(async () => {
          store.dispatch({
            type: actionType,
            asyncFunction: () =>
              new Promise(function(resolve, reject) {
                reject("error");
              })
          });
        });
        expect(renderedItems).toEqual(["error"]);
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
            useOnAsyncRejected([actionType], () => {
              count = count + 1;
            });
          },
          { wrapper: props => <Provider store={store} {...props} /> }
        );

        await act(async () => {
          store.dispatch({
            type: actionType,
            asyncFunction: () =>
              new Promise(function(resolve, reject) {
                reject("");
              })
          });
        });
        expect(count).toEqual(1);

        await act(async () => {
          store.dispatch({ type: pendingTypeCreator(actionType) });
        });
        expect(count).toEqual(1);

        await act(async () => {
          store.dispatch({ type: fulfilledTypeCreator(actionType) });
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
          () => useOnAsyncRejected([actionType], () => {}, "wrongReducerKey"),
          { wrapper: props => <Provider store={store} {...props} /> }
        );
        expect(result.error).toBeInstanceOf(Error);
      });
    });
  });
});
