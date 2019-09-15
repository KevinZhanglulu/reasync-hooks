import { FULFILLED, PENDING, REJECTED } from "./constant";

export function isPromise(value: any) {
  if (value !== null && typeof value === "object") {
    return value && typeof value.then === "function";
  }
  return false;
}

export const asyncActionTypeCreator = (
  type: string
): { pending: string; rejected: string; fulfilled: string } => ({
  pending: `${type}_${PENDING}`,
  fulfilled: `${type}_${FULFILLED}`,
  rejected: `${type}_${REJECTED}`
});
