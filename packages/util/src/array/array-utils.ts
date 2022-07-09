import { Nullish, SimpleValue } from '../types/generic';
import { isNotNullish } from '../generic/generic';

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
  for (const item of array) {
    if (!set.has(item)) {
      set.add(item);
      finalArray.push(item);
    }
  }

  return finalArray;
}

export function distinctItemsBy<TElement, TSelectorResult>(
  array: readonly TElement[],
  distinctBy: (item: TElement) => TSelectorResult
): readonly TElement[] {
  const set = new Set<TSelectorResult>();

  const finalArray: TElement[] = [];
  for (const item of array) {
    const valueToCheck = distinctBy(item);
    if (!set.has(valueToCheck)) {
      set.add(valueToCheck);
      finalArray.push(item);
    }
  }

  return finalArray;
}

export function mapWithSeparators<TInputElement, TOutputElement>(
  array: readonly TInputElement[],
  mappingFn: (item: TInputElement, index: number) => TOutputElement,
  separatorGeneratorFn: (
    index: number,
    itemBefore: TInputElement,
    itemAfter: TInputElement
  ) => TOutputElement
): readonly TOutputElement[] {
  const finalArray: TOutputElement[] = [];

  const length = array.length;
  for (let i = 0; i < length; i++) {
    const item = array[i];
    finalArray.push(mappingFn(item, i));
    if (i < length - 1) {
      finalArray.push(separatorGeneratorFn(i, item, array[i + 1]));
    }
  }
  return finalArray;
}

export function filterOutNullish<TElement>(
  array: readonly TElement[]
): readonly NonNullable<TElement>[] {
  return array.filter((item) =>
    isNotNullish(item)
  ) as unknown as readonly NonNullable<TElement>[];
}
