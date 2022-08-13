import { Db, MongoClient } from 'mongodb';
import { MongoDatabaseInputParams } from './types';

function mongoConnectionParametersToUrl(
  params: MongoDatabaseInputParams
): string {
  return `mongodb://${params.host}:${params.port}/${params.dbName}`;
}

export type MongoDbExecutorFn = (db: Db) => Promise<void>;

export async function executeMongo(
  params: MongoDatabaseInputParams,
  executor: MongoDbExecutorFn
): Promise<void> {
  const mongoUrl = mongoConnectionParametersToUrl(params);
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    const db = client.db();
    await executor(db);
  } finally {
    await client.close();
  }
}
