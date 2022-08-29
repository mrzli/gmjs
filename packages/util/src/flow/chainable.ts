import { flatMap } from '../array/array-utils';

class Chainable<T> {
  private readonly value: T;

  public constructor(value: T) {
    this.value = value;
  }

  public apply<U>(fn: (value: T) => U): Chainable<U> {
    return new Chainable<U>(fn(this.value));
  }

  public map<U, V>(
    this: Chainable<readonly U[]>,
    fn: (item: U) => V
  ): Chainable<readonly V[]> {
    return new Chainable<readonly V[]>(this.value.map(fn));
  }

  public flatMap<U, V>(
    this: Chainable<readonly U[]>,
    fn: (item: U) => readonly V[]
  ): Chainable<readonly V[]> {
    return new Chainable<readonly V[]>(flatMap(this.value, fn));
  }

  public filter<U>(
    this: Chainable<readonly U[]>,
    predicate: (item: U) => boolean
  ): Chainable<readonly U[]> {
    return new Chainable<readonly U[]>(this.value.filter(predicate));
  }

  public getValue(): T {
    return this.value;
  }
}

export function asChainable<T>(value: T): Chainable<T> {
  return new Chainable<T>(value);
}
