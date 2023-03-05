import { AnyValue } from "./generic";

const hiddenSymbol = Symbol();

export type EmptyObject = {
  readonly [hiddenSymbol]: never;
};

export type AnyObject = Record<string, AnyValue>;

export type DeepWriteable<T> = {
  -readonly [K in keyof T]: DeepWriteable<T[K]>;
};

export type MakeUndefinable<T extends AnyObject, K extends keyof T = keyof T> = {
  [Key in K]: T[Key] | undefined;
}

export interface ObjectEntry<T extends AnyObject, K extends keyof T = keyof T> {
  readonly key: keyof T;
  readonly value: T[K];
}
