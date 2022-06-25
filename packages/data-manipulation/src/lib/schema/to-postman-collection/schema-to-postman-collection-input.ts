import { MongoJsonSchemaTypeObject } from '../../shared/mongo-json-schema';

export interface SchemaToPostmanCollectionInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly postmanCollectionName: string;
}
