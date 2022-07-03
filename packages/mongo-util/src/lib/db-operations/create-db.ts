import { Db } from 'mongodb';
import { executeMongo, MongoConnectionParameters } from '../execute-mongo';
import { MongoJsonSchemaTypeObject } from '../mongo-json-schema/mongo-json-schema';
import { pascalCase } from '@gmjs/lib-util';

export async function createDb(
  mongoParams: MongoConnectionParameters,
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
