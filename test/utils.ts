import { FULFILLED, PENDING, REJECTED } from "../src/utils/constant";

export const fulfilledTypeCreator = (type: string): string =>
  `${type}_${FULFILLED}`;

export const rejectedTypeCreator = (type: string): string =>
  `${type}_${REJECTED}`;

export const pendingTypeCreator = (type: string): string =>
  `${type}_${PENDING}`;
