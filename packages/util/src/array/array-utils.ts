import { Nullish, SimpleValue } from '../types/generic';

export function arrayGetPrimitiveDuplicates(
  array: readonly string[]
): readonly string[];
export function arrayGetPrimitiveDuplicates(
  array: readonly number[]
): readonly number[];
export function arrayGetPrimitiveDuplicates(
  array: readonly boolean[]
): readonly boolean[];
export function arrayGetPrimitiveDuplicates<TItem extends Nullish<SimpleValue>>(
  array: readonly TItem[]
): readonly TItem[];
export function arrayGetPrimitiveDuplicates<TItem extends Nullish<SimpleValue>>(
  array: readonly TItem[]
): readonly TItem[] {
  const existingSet = new Set<TItem>();
  const duplicateSet = new Set<TItem>();
  for (const item of array) {
    if (existingSet.has(item)) {
      duplicateSet.add(item);
    } else {
      existingSet.add(item);
    }
  }

  return Array.from(duplicateSet);
}

export function flatMap<TItemInput, TItemResult>(
  array: readonly TItemInput[],
  mapper: (item: TItemInput, index: number) => readonly TItemResult[]
): readonly TItemResult[] {
  return array.reduce<TItemResult[]>((acc, item, index) => {
    const mapped = mapper(item, index);
    acc.push(...mapped);
    return acc;
  }, []);
}
