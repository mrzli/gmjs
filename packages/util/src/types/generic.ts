export type SimpleValue = string | number | boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyValue = any;

const hiddenSymbol = Symbol();

export type EmptyObject = {
  readonly [hiddenSymbol]: never;
};

export type ReadonlyRecord<K extends PropertyKey, TValue> = Readonly<
  Record<K, TValue>
>;
export type ReadonlyPick<TObj, K extends keyof TObj> = Readonly<Pick<TObj, K>>;

export type DeepWriteable<T> = {
  -readonly [K in keyof T]: DeepWriteable<T[K]>;
};

export type AnyObject = Record<string, AnyValue>;

export type Extends<T, U extends T> = U;

export type Nullish<TValue> = TValue | null | undefined;
export type NullishOnly<TValue> = TValue extends null | undefined
  ? TValue
  : never;

export interface ObjectEntry<T extends AnyObject, K extends keyof T = keyof T> {
  readonly key: keyof T;
  readonly value: T[K];
}

export interface Pair<K, V> {
  readonly key: K;
  readonly value: V;
}

export type StringEnumLike = ReadonlyRecord<string, string>;

export type KeyOf<T> = keyof T;
