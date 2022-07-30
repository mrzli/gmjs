import { MongoJsonSchemaTypeObject } from './mongo-json-schema/mongo-json-schema';
import { textToJson } from '@gmjs/lib-util';
import { readTextsByExtensionSync } from '@gmjs/fs-util';
import { ObjectId } from 'mongodb';
import { mongoIdAppToDb } from './data-converters';

export function getSchemasFromDir(
  dirPath: string
): readonly MongoJsonSchemaTypeObject[] {
  return readTextsByExtensionSync(dirPath, 'json').map((f) =>
    textToJson<MongoJsonSchemaTypeObject>(f.content)
  );
}

export interface MongoIdFilter {
  readonly _id: ObjectId;
}

export function mongoIdFilter(id: string): MongoIdFilter {
  return {
    _id: mongoIdAppToDb(id),
  };
}
