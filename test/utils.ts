import { config } from "../src/config";

export const fulfilledTypeCreator = (type: string): string =>
  `${type}_${config.suffix.fulfilled}`;

export const rejectedTypeCreator = (type: string): string =>
  `${type}_${config.suffix.rejected}`;

export const pendingTypeCreator = (type: string): string =>
  `${type}_${config.suffix.pending}`;
