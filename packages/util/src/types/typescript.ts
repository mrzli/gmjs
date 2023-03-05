export type ReadonlyRecord<K extends PropertyKey, TValue> = Readonly<
  Record<K, TValue>
>;
export type ReadonlyPick<TObj, K extends keyof TObj> = Readonly<Pick<TObj, K>>;
