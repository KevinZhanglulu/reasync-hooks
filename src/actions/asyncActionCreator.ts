import {
  fulfilledTypeCreator,
  rejectedTypeCreator,
  pendingTypeCreator
} from "./asyncActionTypeCreators";

const asyncActionTypeCreator = (type: string): string[] => [
  pendingTypeCreator(type),
  fulfilledTypeCreator(type),
  rejectedTypeCreator(type)
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
