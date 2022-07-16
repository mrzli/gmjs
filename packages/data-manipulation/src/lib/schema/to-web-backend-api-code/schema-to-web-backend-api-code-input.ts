import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  SchemaToCodeAppsMonorepoOptions,
  SchemaToCodeInterfacePrefixes,
} from '../shared/types';

export interface SchemaToWebBackendApiCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly options: SchemaToWebBackendApiCodeOptions;
}

export interface SchemaToWebBackendApiCodeOptions {
  readonly appsMonorepo: SchemaToCodeAppsMonorepoOptions;
  readonly interfacePrefixes: SchemaToCodeInterfacePrefixes;
}
