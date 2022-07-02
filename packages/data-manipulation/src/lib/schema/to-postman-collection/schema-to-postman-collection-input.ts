import { MongoJsonSchemaTypeObject } from '../../shared/mongo/mongo-json-schema';

export interface SchemaToPostmanCollectionInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly postmanCollectionName: string;
}
