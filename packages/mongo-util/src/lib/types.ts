import { Except } from 'type-fest';
import { ObjectId } from 'mongodb';

export interface MongoObjectWithId {
  readonly _id: ObjectId;
}

export type MongoWithoutId<T extends MongoObjectWithId> = Except<T, '_id'>;

export interface MongoDatabaseInputParams {
  readonly host: string;
  readonly port: number;
  readonly dbName: string;
}
