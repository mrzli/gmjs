import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  CodeGenerationAppsMonorepoOptions,
  CodeGenerationInterfacePrefixes,
  CodeGenerationLibsModuleNames,
} from '../shared/types';

export interface SchemaToWebBackendApiCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly options: SchemaToWebBackendApiCodeOptions;
}

export interface SchemaToWebBackendApiCodeOptions {
  readonly appsMonorepo: CodeGenerationAppsMonorepoOptions;
  readonly libModuleNames: CodeGenerationLibsModuleNames;
  readonly interfacePrefixes: CodeGenerationInterfacePrefixes;
}
