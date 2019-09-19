import { applyMiddleware, createStore, Store } from "redux";
import * as rtl from "@testing-library/react";

import { act, renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import * as React from "react";
import { fulfilledTypeCreator, rejectedTypeCreator } from "../utils";
import {
  basisMiddlewareCreator,
  middlewareCreator,
  useIsAsyncPendingSelector
} from "../../src";

describe("React", () => {
  describe("hooks", () => {
    describe("useIsAsyncPending", () => {
      const actionType = "ASYNC_ACTION";
      let store: Store;

      afterEach(() => rtl.cleanup());

      // it("selects the isAsyncPending state", async function() {
      //   store = createStore(
      //     ({ count } = { count: -1 }) => ({
      //       count: count + 1
      //     }),
      //     applyMiddleware(middlewareCreator(), basisMiddlewareCreator())
      //   );
      //   const { result } = renderHook(
      //     () => useIsAsyncPendingSelector([actionType]),
      //     {
      //       wrapper: props => <Provider store={store} {...props} />
      //     }
      //   );
      //   expect(result.current).toEqual(false);
      //   await act(async () => {
      //     await store.dispatch({
      //       type: actionType,
      //       asyncFunction: (getState: Function) => {
      //         //Should be expect(result.current).toEqual(true)
      //         return new Promise(function(resolve) {
      //           setTimeout(() => {
      //             expect(getState().asyncState[actionType]).toEqual(PENDING);
      //             resolve("");
      //           }, 1000);
      //         });
      //       }
      //     });
      //   });
      //   expect(result.current).toEqual(false);
      // });

      it("should return false in other conditions", async function() {
        const store = createStore(
          ({ count } = { count: -1 }) => ({
            count: count + 1
          }),
          applyMiddleware(middlewareCreator(), basisMiddlewareCreator())
        );

        const { result } = renderHook(
          () => useIsAsyncPendingSelector([actionType]),
          { wrapper: props => <Provider store={store} {...props} /> }
        );

        await act(async () => {
          store.dispatch({ type: fulfilledTypeCreator(actionType) });
        });
        expect(result.current).toEqual(false);

        await act(async () => {
          store.dispatch({ type: rejectedTypeCreator(actionType) });
        });
        expect(result.current).toEqual(false);
      });
    });
  });
});
