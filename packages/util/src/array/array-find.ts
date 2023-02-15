import { invariant } from '../assert/assert';

export function arrayFindOrThrow<TItem>(
  array: readonly TItem[],
  predicate: (item: TItem) => boolean
): TItem {
  const item = array.find(predicate);
  invariant(!!item, `Item not found.`);
  return item;
}

export function arrayFindLastIndexByPredicate<TItem>(
  array: readonly TItem[],
  predicate: (item: TItem) => boolean
): number {
  for (let i = array.length - 1; i >= 0; i--) {
    const item: TItem = array[i] as TItem;
    if (predicate(item)) {
      return i;
    }
  }

  return -1;
}
