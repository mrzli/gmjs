import { Db, MongoClient } from 'mongodb';

export interface MongoConnectionParameters {
  readonly host: string;
  readonly port: number;
  readonly dbName: string;
}

function mongoConnectionParametersToUrl(
  params: MongoConnectionParameters
): string {
  return `mongodb://${params.host}:${params.port}/${params.dbName}`;
}

export type MongoDbExecutorFn = (db: Db) => Promise<void>;

export async function executeMongo(
  params: MongoConnectionParameters,
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
