import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';

export interface SchemaToPostmanCollectionInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly postmanCollectionName: string;
}
