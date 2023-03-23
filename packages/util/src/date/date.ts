export function dateToUnixMilliseconds(date: Date): number {
  return date.getTime();
}

export function dateToUnixSeconds(date: Date): number {
  return Math.floor(dateToUnixMilliseconds(date) / 1000);
}

export function unixMillisecondsToDate(ms: number): Date {
  return new Date(ms);
}
