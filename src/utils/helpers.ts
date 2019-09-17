import { config } from "../config/";

export function isPromise(value: any) {
  if (value !== null && typeof value === "object") {
    return value && typeof value.then === "function";
  }
  return false;
}

export const asyncActionTypeCreator = (
  type: string
): { pending: string; rejected: string; fulfilled: string } => ({
  pending: `${type}_${config.suffix.pending}`,
  fulfilled: `${type}_${config.suffix.fulfilled}`,
  rejected: `${type}_${config.suffix.rejected}`
});
