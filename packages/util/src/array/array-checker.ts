import { Nullish, SimpleValue } from '../types/generic';

export function arrayHasPrimitiveDuplicates<TItem extends SimpleValue>(
  array: readonly Nullish<TItem>[]
): boolean {
  const set = new Set<Nullish<TItem>>();
  for (const item of array) {
    if (set.has(item)) {
      return true;
    } else {
      set.add(item);
    }
  }

  return false;
}

export function isArrayWithPrimitivesEqual<TItem extends SimpleValue>(
  array1: readonly TItem[],
  array2: readonly TItem[]
): boolean {
  if (array1 === array2) {
    return true;
  }

  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
}
