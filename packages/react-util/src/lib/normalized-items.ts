import { objectFromArray, objectOmitFields, ReadonlyRecord } from '@gmjs/util';
import { ObjectWithId } from '@gmjs/mongo-util';

export interface NormalizedItems<T extends ObjectWithId> {
  readonly ids: readonly string[];
  readonly items: ReadonlyRecord<string, T>;
}

export function createEmptyNormalizedItems<
  T extends ObjectWithId
>(): NormalizedItems<T> {
  return {
    ids: [],
    items: {},
  };
}

export function createNormalizedItems<T extends ObjectWithId>(
  items: readonly T[]
): NormalizedItems<T> {
  return {
    ids: items.map((item) => item.id),
    items: objectFromArray(items, 'id'),
  };
}

export function updateNormalizedItem<T extends ObjectWithId>(
  normalizedItems: NormalizedItems<T>,
  item: T
): NormalizedItems<T> {
  const previousItem = normalizedItems.items[item.id];
  if (previousItem === undefined) {
    return {
      ids: [...normalizedItems.ids, item.id],
      items: {
        ...normalizedItems.items,
        [item.id]: item,
      },
    };
  } else {
    return {
      ...normalizedItems,
      items: {
        ...normalizedItems.items,
        [item.id]: item,
      },
    };
  }
}

export function removeNormalizedItem<T extends ObjectWithId>(
  normalizedItems: NormalizedItems<T>,
  id: string
): NormalizedItems<T> {
  return {
    ids: normalizedItems.ids.filter((currId) => currId !== id),
    items: objectOmitFields(normalizedItems.items, [id]),
  };
}
