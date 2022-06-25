import {
  Db,
  Document,
  InsertManyResult,
  InsertOneResult,
  ObjectId,
} from 'mongodb';

export async function insertOne<TCollectionName extends string>(
  db: Db,
  collectionName: TCollectionName,
  doc: Document
): Promise<ObjectId> {
  const result: InsertOneResult = await db
    .collection(collectionName)
    .insertOne(doc);
  return result.insertedId;
}

export async function insertMany<TCollectionName extends string>(
  db: Db,
  collectionName: TCollectionName,
  docs: readonly Document[]
): Promise<readonly ObjectId[]> {
  const result: InsertManyResult = await db
    .collection(collectionName)
    .insertMany(docs as Document[]);
  const insertedIds = result.insertedIds;
  return (Object.keys(insertedIds) as unknown[] as number[]).map(
    (k) => insertedIds[k]
  );
}
