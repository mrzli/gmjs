import { MongoJsonSchemaTypeObject } from '@gmjs/data-manipulation';

export interface SchemaToPostmanCollectionInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly postmanCollectionName: string;
}
