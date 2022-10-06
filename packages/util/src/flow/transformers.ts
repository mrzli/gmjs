import { isNotNullish } from '../generic/generic';
import { Fn1 } from '../types/function';
import { transformPipe } from './function-pipe';

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

export function flatMap<T, U>(
  mapper: (item: T) => Iterable<U>
): Fn1<Iterable<T>, Iterable<U>> {
  return transformPipe(map(mapper), flatten());
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

export function filterOutNullish<T>(): Fn1<
  Iterable<T>,
  Iterable<NonNullable<T>>
> {
  return function* (input: Iterable<T>): Iterable<NonNullable<T>> {
    for (const inputItem of input) {
      if (isNotNullish(inputItem)) {
        yield inputItem;
      }
    }
  };
}

export function tap<T>(action: (input: T) => void): Fn1<T, T> {
  return (input: T): T => {
    action(input);
    return input;
  };
}

export function distinct<T, THash = T>(
  distinctByFn?: (item1: T) => THash
): Fn1<Iterable<T>, Iterable<T>> {
  return function* (input: Iterable<T>): Iterable<T> {
    const previousItemsSet = new Set<T | THash>();
    for (const inputItem of input) {
      const hash = distinctByFn ? distinctByFn(inputItem) : inputItem;
      if (!previousItemsSet.has(hash)) {
        yield inputItem;
        previousItemsSet.add(hash);
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

export function groupByKey<T, K extends string | number>(
  keySelector: (item: T) => K
): Fn1<Iterable<T>, ReadonlyMap<K, readonly T[]>> {
  return (input: Iterable<T>): ReadonlyMap<K, readonly T[]> => {
    const map = new Map<K, T[]>();
    for (const inputItem of input) {
      const key = keySelector(inputItem);
      const value = map.get(key) ?? [];
      value.push(inputItem);
      map.set(key, value);
    }
    return map;
  };
}

export function toArray<T>(): Fn1<Iterable<T>, readonly T[]> {
  return (input: Iterable<T>) => {
    return [...input];
  };
}

export function toSet<T>(): Fn1<Iterable<T>, ReadonlySet<T>> {
  return (input: Iterable<T>) => {
    return new Set(input);
  };
}

export function toMap<K, V>(): Fn1<
  Iterable<readonly [K, V]>,
  ReadonlyMap<K, V>
> {
  return (input: Iterable<readonly [K, V]>) => {
    return new Map(input);
  };
}
