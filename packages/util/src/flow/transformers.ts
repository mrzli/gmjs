import { Fn1 } from '../types/function';

export function map<T, U>(
  mapper: (item: T) => U
): Fn1<Iterable<T>, Iterable<U>> {
  return function* (input: Iterable<T>): Iterable<U> {
    for (const inputItem of input) {
      yield mapper(inputItem);
    }
  };
}

export function flatten<T>(): Fn1<Iterable<Iterable<T>>, Iterable<T>> {
  return function* (input: Iterable<Iterable<T>>): Iterable<T> {
    for (const inputItem of input) {
      for (const innerItem of inputItem) {
        yield innerItem;
      }
    }
  };
}

export function filter<T>(
  predicate: (item: T) => boolean
): Fn1<Iterable<T>, Iterable<T>> {
  return function* (input: Iterable<T>): Iterable<T> {
    for (const inputItem of input) {
      if (predicate(inputItem)) {
        yield inputItem;
      }
    }
  };
}

export function combineWithEachItem<T, U, V>(
  iterable: Iterable<U>,
  combine: (input: T, item: U) => V
): Fn1<T, Iterable<V>> {
  return function* (input: T): Iterable<V> {
    for (const item of iterable) {
      yield combine(input, item);
    }
  };
}

export function mapCombineWithEachItem<T, U, V>(
  iterable: Iterable<U>,
  combine: (input: T, item: U) => V
): Fn1<Iterable<T>, Iterable<V>> {
  return function* (input: Iterable<T>): Iterable<V> {
    for (const inputItem of input) {
      for (const item of iterable) {
        yield combine(inputItem, item);
      }
    }
  };
}

export function conditionalConvert<T>(
  condition: ((input: T) => boolean) | boolean,
  convertFn: (input: T) => T
): Fn1<T, T> {
  return (input: T): T => {
    const conditionValue =
      condition instanceof Function ? condition(input) : condition;
    if (conditionValue) {
      return convertFn(input);
    } else {
      return input;
    }
  };
}

export function toArray<T>(): Fn1<Iterable<T>, readonly T[]> {
  return (input: Iterable<T>) => {
    return [...input];
  };
}