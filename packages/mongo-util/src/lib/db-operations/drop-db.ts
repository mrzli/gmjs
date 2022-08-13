import { Db } from 'mongodb';
import { executeMongo } from './execute-mongo';
import { MongoDatabaseInputParams } from '../types';

export async function dropDb(
  mongoParams: MongoDatabaseInputParams
): Promise<void> {
  await executeMongo(mongoParams, async (db: Db) => {
    await db.dropDatabase();
  });
}
