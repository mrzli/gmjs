import { AnyObject } from '../types';

export function isBoolean(value: unknown): value is boolean {
  return value === false || value === true;
}

export function isNumber(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    !Number.isNaN(value) &&
    value !== Number.POSITIVE_INFINITY &&
    value !== Number.NEGATIVE_INFINITY
  );
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isDate(value: unknown): value is Date {
  return Object.prototype.toString.call(value) === '[object Date]';
}

export function isArray<T = unknown>(value: unknown): value is Array<T> {
  return Array.isArray(value);
}

export function isObject<T extends AnyObject = AnyObject>(
  value: unknown
): value is T {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isArray(value) &&
    !isDate(value)
  );
}
