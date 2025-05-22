// Convert BigInt nanoseconds to milliseconds
export const toMilliseconds = (nanoseconds: bigint) =>
  Number(nanoseconds) / 1_000_000;
