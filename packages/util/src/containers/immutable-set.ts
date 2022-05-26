import Immutable from 'immutable';
import { AnyObject } from '../types/generic';

export class ImmutableSet<T> {
  private readonly set: Immutable.Set<T>;

  private constructor(set: Immutable.Set<T>) {
    this.set = set;
  }

  public static createEmpty<T>(): ImmutableSet<T> {
    return new ImmutableSet<T>(Immutable.Set());
  }

  public static fromArray<T>(array: readonly T[]): ImmutableSet<T> {
    return new ImmutableSet<T>(Immutable.Set(array));
  }

  public static fromArrayWithFieldMapping<
    T extends AnyObject,
    K extends keyof T
  >(array: readonly T[], field: K): ImmutableSet<T[K]> {
    return ImmutableSet.fromArray<T[K]>(array.map((item) => item[field]));
  }

  public count(): number {
    return this.set.size;
  }

  public toArray(): readonly T[] {
    return this.set.toArray();
  }

  public has(item: T): boolean {
    return this.set.has(item);
  }

  public add(item: T): ImmutableSet<T> {
    return new ImmutableSet<T>(this.set.add(item));
  }

  public remove(item: T): ImmutableSet<T> {
    return new ImmutableSet<T>(this.set.remove(item));
  }

  public clear(): ImmutableSet<T> {
    return ImmutableSet.createEmpty<T>();
  }
}
