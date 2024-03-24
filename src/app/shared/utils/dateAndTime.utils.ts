export function calculateInitialDelay(): number {
  const currentUTCSeconds = Math.floor(new Date().getTime() / 1000);
  const initialDelay = 1000 - (currentUTCSeconds % 1000);
  return initialDelay;
}

export function calculateUpdatedDate(
  rawOffset: number,
  dstOffset: number
): Date {
  const currentUTCDate = new Date();
  const totalOffsetMilliseconds = (rawOffset + dstOffset) * 1000;
  currentUTCDate.setMilliseconds(
    currentUTCDate.getMilliseconds() - 7200 * 1000 + totalOffsetMilliseconds
  );
  return currentUTCDate;
}
