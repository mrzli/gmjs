export interface CookieWrapper<K extends string> {
  readonly get: (name: K) => string | undefined;
  readonly set: (name: K, value: string, expiresInDays?: number) => void;
  readonly remove: (name: K) => void;
  readonly removeMany: (names: readonly K[]) => void;
}
