export interface StorageWrapper<K extends string> {
  readonly get: (key: K) => string | undefined;
  readonly getMany: (keys: readonly K[]) => readonly (string | undefined)[];
  readonly set: (key: K, value: string) => void;
  readonly remove: (key: K) => void;
  readonly removeAll: () => void;
}
