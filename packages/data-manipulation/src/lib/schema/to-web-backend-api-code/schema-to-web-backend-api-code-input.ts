import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  CodeGenerationAppsMonorepoOptions,
  CodeGenerationInterfacePrefixes,
  CodeGenerationLibModuleNames,
} from '../shared/types';

export interface SchemaToWebBackendApiCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly options: SchemaToWebBackendApiCodeOptions;
}

export interface SchemaToWebBackendApiCodeOptions {
  readonly appsMonorepo: CodeGenerationAppsMonorepoOptions;
  readonly libModuleNames: CodeGenerationLibModuleNames;
  readonly interfacePrefixes: CodeGenerationInterfacePrefixes;
}
