import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  CodeGenerationAppsMonorepoOptions,
  CodeGenerationInterfacePrefixes,
  CodeGenerationLibModuleNames,
} from '../shared/types';

export interface SchemaToWebActionReducerCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly options: SchemaToWebActionReducerCodeOptions;
}

export interface SchemaToWebActionReducerCodeOptions {
  readonly appsMonorepo: CodeGenerationAppsMonorepoOptions;
  readonly libModuleNames: CodeGenerationLibModuleNames;
  readonly interfacePrefixes: CodeGenerationInterfacePrefixes;
}
