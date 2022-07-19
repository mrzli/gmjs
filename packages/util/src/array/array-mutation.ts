export function arrayMutateRemoveSingleItemByEquals<T>(
  array: T[],
  item: T
): void {
  const index = array.findIndex((it) => it === item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}
