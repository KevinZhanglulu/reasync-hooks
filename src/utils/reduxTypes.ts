//https://github.com/reduxjs/redux/blob/9c9a4d2a1c62c9dbddcbb05488f8bd77d24c81de/index.d.ts#L1
export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}

export interface Middleware<
  DispatchExt = {},
  S = any,
  D extends Dispatch = Dispatch
> {
  (api: MiddlewareAPI<D, S>): (
    next: Dispatch<AnyAction>
  ) => (action: any) => any;
}

export interface MiddlewareAPI<D extends Dispatch = Dispatch, S = any> {
  dispatch: D;
  getState(): S;
}

export interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): T;
}

export interface Action<T = any> {
  type: T;
}

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S;
