export const config = {
  asyncStateReducerKey: "asyncState",
  suffix: {
    pending: "PENDING",
    fulfilled: "FULFILLED",
    rejected: "REJECTED"
  }
};

export const setConfig = (newConfig: {
  asyncStateReducerKey?: string;
  suffix?: { pending?: string; fulfilled?: string; rejected?: string };
}) => {
  const { asyncStateReducerKey, suffix } = newConfig;

  if (asyncStateReducerKey) config.asyncStateReducerKey = asyncStateReducerKey;
  if (suffix) config.suffix = { ...config.suffix, ...suffix };
};
