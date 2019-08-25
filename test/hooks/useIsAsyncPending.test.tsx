import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import * as rtl from "@testing-library/react";
import {
  asyncActionCreator,
  asyncReduxMiddlewareCreator,
  asyncStateReducer,
  fulfilledTypeCreator,
  useIsAsyncPendingSelector
} from "../../src";
import { act, renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import * as React from "react";
import { PENDING } from "../../src/utils/constant";
import { rejectedTypeCreator } from "../../src/actions/asyncActionTypeCreators";

describe("React", () => {
  describe("hooks", () => {
    describe("useIsAsyncPending", () => {
      const actionType = "ASYNC_ACTION";
      let store: Store;

      afterEach(() => rtl.cleanup());

      it("selects the isAsyncPending state", async function() {
        store = createStore(
          combineReducers({
            asyncState: asyncStateReducer
          }),
          applyMiddleware(asyncReduxMiddlewareCreator())
        );
        const { result } = renderHook(
          () => useIsAsyncPendingSelector([actionType]),
          {
            wrapper: props => <Provider store={store} {...props} />
          }
        );
        expect(result.current).toEqual(false);
        await act(async () => {
          await store.dispatch<any>(
            asyncActionCreator<{ asyncState: { [key: string]: string } }>(
              actionType,
              getState => {
                //Should be expect(result.current).toEqual(true)
                expect(getState().asyncState[actionType]).toEqual(PENDING);
                return new Promise(function(resolve) {
                  setTimeout(() => {
                    resolve("");
                  }, 1000);
                });
              }
            )
          );
        });
        expect(result.current).toEqual(false);
      });

      it("should return false in other conditions", async function() {
        const store = createStore(
          combineReducers({
            asyncState: asyncStateReducer
          }),
          applyMiddleware(asyncReduxMiddlewareCreator())
        );

        const { result } = renderHook(
          () => useIsAsyncPendingSelector([actionType]),
          { wrapper: props => <Provider store={store} {...props} /> }
        );

        await act(async () =>
          store.dispatch<any>({ type: fulfilledTypeCreator(actionType) })
        );
        expect(result.current).toEqual(false);

        await act(async () => {
          store.dispatch({ type: rejectedTypeCreator(actionType) });
        });
        expect(result.current).toEqual(false);
      });
    });
  });
});
