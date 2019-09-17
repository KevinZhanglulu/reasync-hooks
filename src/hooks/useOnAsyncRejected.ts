import { onAsyncStateHookCreator } from "./onAsyncStateHookCreator";
import { config } from "../config/";

export const useOnAsyncRejected = onAsyncStateHookCreator(
  config.suffix.rejected
);
