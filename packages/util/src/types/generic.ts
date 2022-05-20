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

export type AnyObject = Record<string, AnyValue>;

export type Extends<T, U extends T> = U;

export type Nullish<TValue> = TValue | null | undefined;
export type NullishOnly<TValue> = TValue extends null | undefined
  ? TValue
  : never;

export type ReadonlyTuple2<T1, T2> = readonly [T1, T2];
export type ReadonlyTuple3<T1, T2, T3> = readonly [T1, T2, T3];
export type ReadonlyTuple4<T1, T2, T3, T4> = readonly [T1, T2, T3, T4];

export type StringEnumLike = ReadonlyRecord<string, string>;

export type KeyOf<T> = keyof T;

export type ArrayMinLength1<T> = readonly [T, ...T[]];
export type ArrayMinLength2<T> = readonly [T, T, ...T[]];
export type ArrayMinLength3<T> = readonly [T, T, T, ...T[]];
export type ArrayMinLength4<T> = readonly [T, T, T, T, ...T[]];
export type ArrayMinLength5<T> = readonly [T, T, T, T, T, ...T[]];
