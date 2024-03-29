import { SimpleValue } from './../../types/generic';
import { isNotNullish } from '../../generic/generic';
import { Fn1 } from '../../types/function';
import { transformPipe } from '../function-pipe';

export function map<T, U>(
  mapper: (item: T, index: number) => U
): Fn1<Iterable<T>, Iterable<U>> {
  return function* (input: Iterable<T>): Iterable<U> {
    let index = 0;
    for (const inputItem of input) {
      yield mapper(inputItem, index++);
    }
  };
}

export function indexes<T>(
): Fn1<Iterable<T>, Iterable<number>> {
  return function* (input: Iterable<T>): Iterable<number> {
    let index = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _inputItem of input) {
      yield index++;
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
  predicate: (item: T, index: number) => boolean
): Fn1<Iterable<T>, Iterable<T>> {
  return function* (input: Iterable<T>): Iterable<T> {
    let index = 0;
    for (const inputItem of input) {
      if (predicate(inputItem, index++)) {
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

export function concat<T>(other: Iterable<T>): Fn1<Iterable<T>, Iterable<T>> {
  return function* (input: Iterable<T>): Iterable<T> {
    for (const inputItem of input) {
      yield inputItem;
    }
    for (const inputItem of other) {
      yield inputItem;
    }
  };
}

export function reverse<T>(): Fn1<Iterable<T>, Iterable<T>> {
  return (input: Iterable<T>) => {
    const array = [...input];
    array.reverse();
    return array;
  };
}

export function sort<T>(
  compareFn: (item1: T, item2: T) => number
): Fn1<Iterable<T>, Iterable<T>> {
  return (input: Iterable<T>) => {
    const array = [...input];
    array.sort(compareFn);
    return array;
  };
}

export function tapIterable<T>(
  action: (item: T, index: number) => void
): Fn1<Iterable<T>, Iterable<T>> {
  return function* (input: Iterable<T>): Iterable<T> {
    let index = 0;
    for (const inputItem of input) {
      action(inputItem, index++);
      yield inputItem;
    }
  };
}

export function distinct<T, THash = T>(
  distinctByFn?: (item: T) => THash
): Fn1<Iterable<T>, Iterable<T>> {
  return function* (input: Iterable<T>): Iterable<T> {
    const previousItemsSet = new Set<T | THash>();
    for (const inputItem of input) {
      const hash = distinctByFn ? distinctByFn(inputItem) : inputItem;
      if (!previousItemsSet.has(hash)) {
        previousItemsSet.add(hash);
        yield inputItem;
      }
    }
  };
}

export function duplicates<T, THash = T>(
  distinctByFn?: (item: T) => THash
): Fn1<Iterable<T>, Iterable<T>> {
  return function* (input: Iterable<T>): Iterable<T> {
    const previousItemsSet = new Set<T | THash>();
    for (const inputItem of input) {
      const hash = distinctByFn ? distinctByFn(inputItem) : inputItem;
      if (previousItemsSet.has(hash)) {
        yield inputItem;
      } else {
        previousItemsSet.add(hash);
      }
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

export function combineIterables<T, U, V>(
  iterable: Iterable<U>,
  combine: (input: T, item: U, index: number) => V
): Fn1<Iterable<T>, Iterable<V>> {
  return function* (input: Iterable<T>): Iterable<V> {
    let index = 0;
    const iter1 = input[Symbol.iterator]();
    const iter2 = iterable[Symbol.iterator]();

    while (true) {
      const item1 = iter1.next();
      const item2 = iter2.next();

      if (item1.done || item2.done) {
        if (!item1.done || !item2.done) {
          throw new Error(`Iterables must have the same number of elements.`);
        }
        break;
      }

      yield combine(item1.value, item2.value, index++);
    }
  };
}

export function groupBySimpleKey<T, K extends SimpleValue>(
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

export function keys<K, V>(): Fn1<Iterable<readonly [K, V]>, Iterable<K>> {
  return function* (input: Iterable<readonly [K, V]>): Iterable<K> {
    for (const inputItem of input) {
      yield inputItem[0];
    }
  };
}

export function values<K, V>(): Fn1<Iterable<readonly [K, V]>, Iterable<V>> {
  return function* (input: Iterable<readonly [K, V]>): Iterable<V> {
    for (const inputItem of input) {
      yield inputItem[1];
    }
  };
}

export function aggregate<T, U, K>(
  aggregateFn: (input: Iterable<T>) => U
): Fn1<ReadonlyMap<K, Iterable<T>>, ReadonlyMap<K, U>> {
  return transformPipe(
    map(([k, v]) => [k, aggregateFn(v)] as const),
    toMap()
  );
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
