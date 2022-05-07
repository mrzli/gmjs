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
