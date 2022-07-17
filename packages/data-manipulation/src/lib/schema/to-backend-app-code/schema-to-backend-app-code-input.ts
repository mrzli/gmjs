import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  CodeGenerationAppsMonorepoOptions,
  CodeGenerationInterfacePrefixes,
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
  readonly appsMonorepo: CodeGenerationAppsMonorepoOptions;
  readonly interfacePrefixes: CodeGenerationInterfacePrefixes;
}
