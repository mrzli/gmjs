import { ReadonlyRecord } from "./typescript";

export type SimpleValue = string | number | boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyValue = any;

export type Extends<T, U extends T> = U;

export type Nullish<TValue> = TValue | null | undefined;
export type NullishOnly<TValue> = TValue extends null | undefined
  ? TValue
  : never;

export type StringEnumLike = ReadonlyRecord<string, string>;

export type KeyOf<T> = keyof T;

export type NotIterable<T> = T extends Iterable<AnyValue> ? never : T;
