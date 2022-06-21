import { MongoDataToDataResult } from './mongo-data-to-data-result';
import {
  MongoDataToDataInput,
  MongoDataToDataTestOverrides,
} from './mongo-data-to-data-input';
import { ObjectId } from 'mongodb';

export function dataModelToData(
  input: MongoDataToDataInput,
  testOverrides?: MongoDataToDataTestOverrides
): MongoDataToDataResult {
  testOverrides ??= { generateObjectId: () => new ObjectId() };

  return {};
}
