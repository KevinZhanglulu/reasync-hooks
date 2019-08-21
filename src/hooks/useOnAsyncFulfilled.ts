import { onAsyncStateHookCreator } from "./onAsyncStateHookCreator";
import { FULFILLED } from "../utils/constant";

export const useOnAsyncFulfilled = onAsyncStateHookCreator(FULFILLED);
