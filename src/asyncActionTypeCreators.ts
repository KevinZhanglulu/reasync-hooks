import { FULFILLED, REJECTED, PENDING } from "./constant";

export const asyncFulfilledActionTypeCreator = (type: string): string =>
  `${type}_${FULFILLED}`;

export const asyncRejectedActionTypeCreator = (type: string): string =>
  `${type}_${REJECTED}`;

export const asyncPendingActionTypeCreator = (type: string): string =>
  `${type}_${PENDING}`;
