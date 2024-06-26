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

export function convertUnixTimestampToUTC(timestamp: number) {
  const utcDate = new Date(timestamp * 1000);

  return utcDate.toUTCString();
}

export function convertDateToUnixTimestamp(date: Date) {
  return Math.floor(date.getTime() / 1000);
}
