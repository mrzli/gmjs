import { Client } from 'pg';
import { PgDatabaseInputParams } from '../types';

export type PgDbExecutorFn = (client: Client) => Promise<void>;

export async function executePostgres(
  params: PgDatabaseInputParams,
  executor: PgDbExecutorFn
): Promise<void> {
  const client = new Client(params);
  try {
    await client.connect();
    await executor(client);
  } finally {
    await client.end();
  }
}
