import { createStorageWrapper } from './storage-wrapper';
import { StorageWrapper } from '../types/storage-wrapper';

export function createLocalStorageWrapper<
  K extends string
>(): StorageWrapper<K> {
  return createStorageWrapper<K>(window.localStorage);
}
