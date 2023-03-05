import { Fn1 } from '../../types/function';

export function sum(): Fn1<Iterable<number>, number> {
  return (input: Iterable<number>) => {
    let total = 0;
    for (const item of input) {
      total += item;
    }
    return total;
  };
}

export function cumSum(): Fn1<Iterable<number>, Iterable<number>> {
  return function* (input: Iterable<number>): Iterable<number> {
    let total = 0;
    for (const item of input) {
      total += item;
      yield total;
    }
  }
}
