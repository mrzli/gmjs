import {
  arrayMutateRemoveSingleItemByEquals,
  ReadonlyRecord,
} from '@gmjs/util';
import { ObjectWithId } from '@gmjs/mongo-util';
import { Draft } from 'immer';

export interface NormalizedItems<T extends ObjectWithId> {
  readonly ids: readonly string[];
  readonly items: ReadonlyRecord<string, T>;
}

export function createNormalizedItems<
  T extends ObjectWithId
>(): NormalizedItems<T> {
  return {
    ids: [],
    items: {},
  };
}

export function toNormalizedItems<T extends ObjectWithId>(
  items: readonly T[]
): Draft<NormalizedItems<T>> {
  return {
    ids: items.map((item) => item.id),
    items: items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
  };
}

export function updateNormalizedItem<T extends ObjectWithId>(
  normalizedItems: Draft<NormalizedItems<T>>,
  item: Draft<T>
): void {
  const previousItem = normalizedItems.items[item.id];
  normalizedItems.items[item.id] = item;
  if (previousItem === undefined) {
    normalizedItems.ids.push(item.id);
  }
}

export function removeNormalizedItem<T extends ObjectWithId>(
  normalizedItems: Draft<NormalizedItems<T>>,
  id: string
): void {
  arrayMutateRemoveSingleItemByEquals(normalizedItems.ids, id);
  delete normalizedItems.items[id];
}

export function clearNormalizedItems<T extends ObjectWithId>(
  normalizedItems: Draft<NormalizedItems<T>>
): void {
  normalizedItems.ids = [];
  normalizedItems.items = {};
}
