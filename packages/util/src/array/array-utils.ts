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

export function distinctItems<TElement>(
  array: readonly TElement[]
): readonly TElement[] {
  const set = new Set<TElement>();

  // using mutable array and forEach for performance
  const finalArray: TElement[] = [];
  array.forEach((item) => {
    if (!set.has(item)) {
      set.add(item);
      finalArray.push(item);
    }
  });

  return finalArray;
}

export function distinctItemsBy<TElement, TSelectorResult>(
  array: readonly TElement[],
  distinctBy: (item: TElement) => TSelectorResult
): readonly TElement[] {
  const set = new Set<TSelectorResult>();

  // using mutable array and forEach for performance
  const finalArray: TElement[] = [];
  array.forEach((item) => {
    const valueToCheck = distinctBy(item);
    if (!set.has(valueToCheck)) {
      set.add(valueToCheck);
      finalArray.push(item);
    }
  });

  return finalArray;
}
