import {
  asyncFulfilledActionTypeCreator,
  asyncPendingActionTypeCreator,
  asyncRejectedActionTypeCreator
} from "./asyncActionTypeCreators";

const asyncActionTypeCreator = (type: string): string[] => [
  asyncPendingActionTypeCreator(type),
  asyncFulfilledActionTypeCreator(type),
  asyncRejectedActionTypeCreator(type)
];

export const asyncActionCreator = <T>(
  action: string,
  asyncFunction: (getState: () => T) => Promise<any>,
  extraArgument = {}
) => {
  return {
    types: asyncActionTypeCreator(action),
    asyncFunction,
    extraArgument
  };
};
