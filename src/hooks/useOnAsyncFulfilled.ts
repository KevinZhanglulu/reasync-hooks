import { onAsyncStateHookCreator } from "./onAsyncStateHookCreator";
import { config } from "../config/";

export const useOnAsyncFulfilled = onAsyncStateHookCreator(
  config.suffix.fulfilled
);
