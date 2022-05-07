export function arrayFindLastIndexOfWithPredicate<TItem>(
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
