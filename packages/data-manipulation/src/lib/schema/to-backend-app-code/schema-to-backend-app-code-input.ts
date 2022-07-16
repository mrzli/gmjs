import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  SchemaToCodeAppsMonorepoOptions,
  SchemaToCodeInterfacePrefixes,
} from '../shared/types';

export interface SchemaToBackendAppCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly initialFiles: SchemaToBackendAppCodeInitialFiles;
  readonly options: SchemaToBackendAppCodeOptions;
}

export interface SchemaToBackendAppCodeInitialFiles {
  readonly appModule: string;
}

export interface SchemaToBackendAppCodeOptions {
  readonly appsMonorepo: SchemaToCodeAppsMonorepoOptions;
  readonly interfacePrefixes: SchemaToCodeInterfacePrefixes;
}
