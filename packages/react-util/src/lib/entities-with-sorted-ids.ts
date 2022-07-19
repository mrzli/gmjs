import { objectFromArray, ReadonlyRecord } from '@gmjs/util';
import { ObjectWithId } from '@gmjs/mongo-util';
import { ConditionalKeys } from 'type-fest';

export interface EntitiesWithSortedIds<T> {
  readonly ids: readonly string[];
  readonly entities: ReadonlyRecord<string, T>;
}

export function createEmptyEntitiesWithSortedIds<
  T
>(): EntitiesWithSortedIds<T> {
  return {
    ids: [],
    entities: {},
  };
}

export function toEntitiesWithSortedIds<T extends ObjectWithId>(
  entities: readonly T[]
): EntitiesWithSortedIds<T> {
  // TODO GM: remove cast if this start working
  //  currently, it seems typescript does not recognize that T must have an 'id' key with type string
  const entitiesObj = objectFromArray(
    entities,
    'id' as string & ConditionalKeys<T, string>
  );
  return {
    ids: entities.map((ent) => ent.id),
    entities: entitiesObj,
  };
}
