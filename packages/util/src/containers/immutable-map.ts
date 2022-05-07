import * as Immutable from 'immutable';
import { AnyObject } from '../types/generic';

export interface ImmutableMapKeyValuePair<K, V> {
  readonly key: K;
  readonly value: V;
}

export class ImmutableMap<K, V> {
  private readonly map: Immutable.Map<K, V>;

  private constructor(map: Immutable.Map<K, V>) {
    this.map = map;
  }

  public static createEmpty<K, V>(): ImmutableMap<K, V> {
    return new ImmutableMap<K, V>(Immutable.Map<K, V>());
  }

  public static fromTupleArray<K, V>(
    array: readonly [K, V][]
  ): ImmutableMap<K, V> {
    return new ImmutableMap<K, V>(Immutable.Map(array));
  }

  public static fromPairArray<K, V>(
    array: readonly ImmutableMapKeyValuePair<K, V>[]
  ): ImmutableMap<K, V> {
    const tupleArray: readonly [K, V][] = array.map(pairToTuple);
    return ImmutableMap.fromTupleArray<K, V>(tupleArray);
  }

  public static fromArrayWithKeyField<T extends AnyObject, K extends keyof T>(
    array: readonly T[],
    keyField: K
  ): ImmutableMap<T[K], T> {
    const tupleArray: readonly [T[K], T][] = array.map((item) => [
      item[keyField],
      item,
    ]);
    return ImmutableMap.fromTupleArray<T[K], T>(tupleArray);
  }

  public keys(): readonly K[] {
    return this.map.keySeq().toArray();
  }

  public values(): readonly V[] {
    return this.map.valueSeq().toArray();
  }

  public entryTuples(): readonly [K, V][] {
    const sequence: Immutable.Seq.Indexed<[K, V]> =
      this.map.entrySeq() as Immutable.Seq.Indexed<[K, V]>; // not sure why this causes an error without cast
    return sequence.toArray();
  }

  public entryPairs(): readonly ImmutableMapKeyValuePair<K, V>[] {
    return this.entryTuples().map(tupleToPair);
  }

  public has(key: K): boolean {
    return this.map.has(key);
  }

  public get(key: K): V | undefined {
    return this.map.get(key);
  }

  public getWithFallbackValue(key: K, fallbackValue: V): V {
    return this.map.get(key, fallbackValue);
  }

  public getOrThrow(key: K): V {
    if (!this.map.has(key)) {
      throw new Error(`Expected map to have an entry for key: '${key}'`);
    }

    return this.get(key) as V;
  }

  public set(key: K, value: V): ImmutableMap<K, V> {
    return new ImmutableMap<K, V>(this.map.set(key, value));
  }

  public remove(key: K): ImmutableMap<K, V> {
    return new ImmutableMap<K, V>(this.map.remove(key));
  }

  public clear(): ImmutableMap<K, V> {
    return ImmutableMap.createEmpty<K, V>();
  }
}

function tupleToPair<K, V>(tuple: [K, V]): ImmutableMapKeyValuePair<K, V> {
  return { key: tuple[0], value: tuple[1] };
}

function pairToTuple<K, V>(pair: ImmutableMapKeyValuePair<K, V>): [K, V] {
  return [pair.key, pair.value];
}
