import { ObjectId } from 'mongodb';

export interface MongoDataToDataInput {
  readonly dataModelYamlContent: string;
  readonly numEntries: number;
}

export interface MongoDataToDataTestOverrides {
  readonly generateObjectId: () => ObjectId;
}
