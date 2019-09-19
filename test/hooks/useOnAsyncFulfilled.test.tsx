import { applyMiddleware, createStore, Reducer } from "redux";
import * as rtl from "@testing-library/react";
import {
  basisMiddlewareCreator,
  middlewareCreator,
  useOnAsyncFulfilled
} from "../../src";
import { act, renderHook } from "@testing-library/react-hooks";
import { Provider, useStore } from "react-redux";
import * as React from "react";
import { AsyncHandler } from "../../src/middlewareCreatorFactory";
import {
  fulfilledTypeCreator,
  pendingTypeCreator,
  rejectedTypeCreator
} from "../utils";

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
          ({ count } = { count: -1 }) => ({
            count: count + 1
          }),
          applyMiddleware(middlewareCreator(), basisMiddlewareCreator())
        );
        renderHook(
          () => {
            useOnAsyncFulfilled([actionType], asyncType => {
              renderedItems.push(asyncType);
            });
          },
          { wrapper: props => <Provider store={store} {...props} /> }
        );
        await act(async () => {
          store.dispatch({
            type: actionType,
            asyncFunction: () =>
              new Promise(function(resolve) {
                resolve("");
              })
          });
        });
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
        const reduxMiddleware = middlewareCreator({
          fulfilledHandler
        });

        const resolveReducer: Reducer = (state = {}, action) => {
          if (action.type === fulfilledTypeCreator(actionType))
            return { ...state, data: action.data };
          return state;
        };

        const store = createStore(
          ({ count } = { count: -1 }) => ({
            count: count + 1
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

        await act(async () => {
          store.dispatch({
            type: actionType,
            asyncFunction: () =>
              new Promise(function(resolve) {
                resolve("data");
              })
          });
        });
        expect(renderedItems).toEqual(["data"]);
      });

      it("should not call the handler in other conditions", async function() {
        let count = 0;
        const store = createStore(
          ({ count } = { count: -1 }) => ({
            count: count + 1
          }),

          applyMiddleware(middlewareCreator(), basisMiddlewareCreator())
        );
        renderHook(
          () => {
            useOnAsyncFulfilled([actionType], () => {
              count = count + 1;
            });
          },
          { wrapper: props => <Provider store={store} {...props} /> }
        );
        await act(async () => {
          store.dispatch({
            type: actionType,
            asyncFunction: () =>
              new Promise(function(resolve) {
                resolve("");
              })
          });
        });
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
    });
  });
});
