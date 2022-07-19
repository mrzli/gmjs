import { Except } from 'type-fest';
import { ObjectId } from 'mongodb';

export interface ObjectWithId {
  readonly id: string;
}

export type WithoutId<T extends ObjectWithId> = Except<T, 'id'>;

export interface DbObjectWithId {
  readonly _id: ObjectId;
}

export type DbWithoutId<T extends DbObjectWithId> = Except<T, '_id'>;
