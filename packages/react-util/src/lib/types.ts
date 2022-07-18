import { ReadonlyRecord } from '@gmjs/util';

export interface SortedIdsAndEntities<T> {
  readonly ids: readonly string[];
  readonly entities: ReadonlyRecord<string, T>;
}
