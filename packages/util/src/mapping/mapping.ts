import { isNotNullish } from '../generic/generic';
import { Nullish } from '../types/generic';

export function transformIfExists<T, U>(
  value: T | undefined,
  transformer: (input: T) => U,
  defaultValue: U | undefined
): U | undefined;
export function transformIfExists<T, U>(
  value: T | null,
  transformer: (input: T) => U,
  defaultValue: U | null
): U | null;
export function transformIfExists<T, U>(
  value: Nullish<T>,
  transformer: (input: T) => U,
  defaultValue: Nullish<U>
): Nullish<U>;
export function transformIfExists<T, U>(
  value: Nullish<T>,
  transformer: (input: T) => U,
  defaultValue: Nullish<U>
): Nullish<U> {
  return isNotNullish(value) ? transformer(value) : defaultValue;
}
