import { Fn1 } from '../types/function';

export function map<T, U>(
  mapper: (item: T) => U
): Fn1<Iterable<T>, Iterable<U>> {
  return function* (iterable: Iterable<T>): Iterable<U> {
    for (const item of iterable) {
      yield mapper(item);
    }
  };
}

export function flatten<T>(): Fn1<Iterable<Iterable<T>>, Iterable<T>> {
  return function* (iterable: Iterable<Iterable<T>>): Iterable<T> {
    for (const item of iterable) {
      for (const innerItem of item) {
        yield innerItem;
      }
    }
  };
}

export function filter<T>(
  predicate: (item: T) => boolean
): Fn1<Iterable<T>, Iterable<T>> {
  return function* (iterable: Iterable<T>): Iterable<T> {
    for (const item of iterable) {
      if (predicate(item)) {
        yield item;
      }
    }
  };
}

export function toArray<T>(): Fn1<Iterable<T>, readonly T[]> {
  return (iterable: Iterable<T>) => {
    return [...iterable];
  }
}
