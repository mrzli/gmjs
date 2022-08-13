import { Db } from 'mongodb';
import { executeMongo } from './execute-mongo';
import { MongoJsonSchemaTypeObject } from '../mongo-json-schema/mongo-json-schema';
import { pascalCase } from '@gmjs/lib-util';
import { MongoDatabaseInputParams } from '../types';

export async function createDb(
  mongoParams: MongoDatabaseInputParams,
  schemas: readonly MongoJsonSchemaTypeObject[]
): Promise<void> {
  await executeMongo(mongoParams, async (db: Db) => {
    await Promise.all(
      schemas.map((schema) =>
        db.createCollection(pascalCase(schema.title), {
          validator: {
            $jsonSchema: schema,
          },
        })
      )
    );
  });
}
