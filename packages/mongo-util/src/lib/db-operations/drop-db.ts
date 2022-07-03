import { Db } from 'mongodb';
import { executeMongo, MongoConnectionParameters } from '../execute-mongo';

export async function dropDb(
  mongoParams: MongoConnectionParameters
): Promise<void> {
  await executeMongo(mongoParams, async (db: Db) => {
    await db.dropDatabase();
  });
}
