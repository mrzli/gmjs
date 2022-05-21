import { ConditionalKeys, Except } from 'type-fest';
import { AnyObject, ObjectEntry, ReadonlyRecord } from '../types/generic';

// https://stackoverflow.com/a/61765012/520229
// dual declaration to allow both implementation and proper type checking
// another option is to just have the first declaration with implementation: 'return obj[key] as unknown as V;'
export function objectGetFieldValueOfType<TObj, TValue>(
  obj: TObj,
  key: ConditionalKeys<TObj, TValue>
): TValue;
export function objectGetFieldValueOfType<TKey extends PropertyKey, TValue>(
  obj: Record<TKey, TValue>,
  key: TKey
): TValue {
  return obj[key];
}

export function objectGetKeys<T extends AnyObject, K extends keyof T = keyof T>(
  obj: T
): readonly K[] {
  return Object.keys(obj) as unknown as readonly K[];
}

export function objectGetEntries<T extends AnyObject>(
  obj: T
): readonly ObjectEntry<T>[] {
  return objectGetKeys(obj).map((key) => ({ key, value: obj[key] }));
}

export function objectOmitFields<T extends AnyObject, K extends keyof T>(
  obj: T,
  fieldsToOmit: readonly K[]
): Except<T, K> {
  const fieldsToOmitSet = new Set<K>(fieldsToOmit);
  const result = objectGetKeys<T, K>(obj).reduce((acc, key) => {
    if (!fieldsToOmitSet.has(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Partial<T>);
  return result as unknown as Except<T, K>;
}

export function objectPickFields<T extends AnyObject, K extends keyof T>(
  obj: T,
  fieldsToPick: readonly K[]
): Pick<T, K> {
  const fieldsToPickSet = new Set<K>(fieldsToPick);
  const result = objectGetKeys<T, K>(obj).reduce((acc, key) => {
    if (fieldsToPickSet.has(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Partial<T>);
  return result as Pick<T, K>;
}

export function objectPickAndConvertFields<
  T extends AnyObject,
  TInputType,
  TOutputType,
  K extends string & ConditionalKeys<T, TInputType>
>(
  obj: T,
  fieldsToPick: readonly K[],
  convertFn: (value: TInputType) => TOutputType
): ReadonlyRecord<K, TOutputType> {
  const pickedFields: Pick<T, K> = objectPickFields(obj, fieldsToPick);
  const result = objectGetKeys<Pick<T, K>, K>(pickedFields).reduce(
    (acc: Partial<Record<K, TOutputType>>, key: K) => {
      acc[key] = convertFn(obj[key]);
      return acc;
    },
    {} as Partial<Record<K, TOutputType>>
  );
  return result as ReadonlyRecord<K, TOutputType>;
}

export function objectRemoveUndefined<T extends AnyObject>(obj: T): Partial<T> {
  const newObj: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
