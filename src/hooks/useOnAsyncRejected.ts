import { onAsyncStateHookCreator } from "./onAsyncStateHookCreator";
import { REJECTED } from "../utils/constant";

export const useOnAsyncRejected = onAsyncStateHookCreator(REJECTED);
