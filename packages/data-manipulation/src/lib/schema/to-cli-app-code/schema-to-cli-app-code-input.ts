import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import { SchemaToCodeAppsMonorepoOptions } from '../shared/types';

export interface SchemaToCliAppCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly options: SchemaToCliAppCodeOptions;
}

export interface SchemaToCliAppCodeOptions {
  readonly appsMonorepo: SchemaToCodeAppsMonorepoOptions;
}
