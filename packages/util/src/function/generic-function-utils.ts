// eslint-disable-next-line @typescript-eslint/no-empty-function
export function emptyFn(): void {}

export function identifyFn<T>(value: T): T {
  return value;
}

export function alwaysTruePredicate(): boolean {
  return true;
}

export function alwaysFalsePredicate(): boolean {
  return false;
}
