import { NullishOnly } from '../types/generic';

export function isNullish<T>(value: T): value is NullishOnly<T> {
  return value === null || value === undefined;
}

export function isNotNullish<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
