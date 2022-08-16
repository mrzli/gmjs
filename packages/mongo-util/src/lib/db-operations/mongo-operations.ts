import { Db, Document, InsertManyResult, InsertOneResult } from 'mongodb';
import { propIdDbToApp } from '../db-converters/prop-converters';

export async function insertOne<
  TCollectionName extends string,
  TAppModel,
  TDbModel extends Document
>(
  db: Db,
  collectionName: TCollectionName,
  doc: TAppModel,
  appToDbConverterFn: (doc: TAppModel) => TDbModel
): Promise<string> {
  const dbDoc = appToDbConverterFn(doc);
  const result: InsertOneResult = await db
    .collection(collectionName)
    .insertOne(dbDoc);
  return propIdDbToApp(result.insertedId);
}

export async function insertMany<
  TCollectionName extends string,
  TAppModel,
  TDbModel extends Document
>(
  db: Db,
  collectionName: TCollectionName,
  docs: readonly TAppModel[],
  appToDbConverterFn: (doc: TAppModel) => TDbModel
): Promise<readonly string[]> {
  const dbDocs = docs.map(appToDbConverterFn);
  const result: InsertManyResult = await db
    .collection(collectionName)
    .insertMany(dbDocs);
  const insertedIds = result.insertedIds;
  return (Object.keys(insertedIds) as unknown[] as number[]).map((k) =>
    propIdDbToApp(insertedIds[k])
  );
}
