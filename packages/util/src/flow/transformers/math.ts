import { Fn1 } from '../../types/function';
import { transformPipe } from '../function-pipe';
import { map } from './iterable';

export function sum(): Fn1<Iterable<number>, number> {
  return (input: Iterable<number>) => {
    let total = 0;
    for (const item of input) {
      total += item;
    }
    return total;
  };
}

export function sumBy<T>(
  valueSelector: (item: T) => number
): Fn1<Iterable<T>, number> {
  return transformPipe(map(valueSelector), sum());
}

export function cumSum(): Fn1<Iterable<number>, Iterable<number>> {
  return function* (input: Iterable<number>): Iterable<number> {
    let total = 0;
    for (const item of input) {
      total += item;
      yield total;
    }
  };
}

export function cumSumBy<T>(
  valueSelector: (item: T) => number
): Fn1<Iterable<T>, Iterable<number>> {
  return transformPipe(map(valueSelector), cumSum());
}

export function mean(): Fn1<Iterable<number>, number> {
  return (input: Iterable<number>) => {
    const array = [...input];
    if (array.length === 0) {
      return 0;
    }
    return sum()(array) / array.length;
  };
}

export function meanBy<T>(
  valueSelector: (item: T) => number
): Fn1<Iterable<T>, number> {
  return transformPipe(map(valueSelector), mean());
}
