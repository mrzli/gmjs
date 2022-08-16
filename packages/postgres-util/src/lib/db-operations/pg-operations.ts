import { Client } from 'pg';

export async function insertOne<TAppModel>(
  client: Client,
  doc: TAppModel,
  appToDbConverterFn: (doc: TAppModel) => string
): Promise<void> {
  await client.query(appToDbConverterFn(doc));
}

export async function insertMany<TAppModel>(
  client: Client,
  docs: readonly TAppModel[],
  appToDbConverterFn: (doc: TAppModel) => string
): Promise<void> {
  await client.query(docs.map(appToDbConverterFn).join('\n'));
}
