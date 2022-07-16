import { StorageWrapper } from '../types/storage-wrapper';

export function createStorageWrapper<K extends string>(
  storage: Storage
): StorageWrapper<K> {
  return {
    get: (key) => get(storage, key),
    getMany: (keys: readonly K[]) => getMany(storage, keys),
    set: (key, value) => {
      storage.setItem(key, value);
    },
    remove: (key) => {
      storage.removeItem(key);
    },
    removeAll: () => {
      storage.clear();
    },
  };
}

function get<K extends string>(storage: Storage, key: K): string | undefined {
  return storage.getItem(key) ?? undefined;
}

function getMany<K extends string>(
  storage: Storage,
  keys: readonly K[]
): readonly (string | undefined)[] {
  return keys.map((key) => get(storage, key));
}
