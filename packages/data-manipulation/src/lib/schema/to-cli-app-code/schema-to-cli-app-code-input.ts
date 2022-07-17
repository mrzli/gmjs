import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  CodeGenerationAppsMonorepoOptions,
  CodeGenerationLibModuleNames,
} from '../shared/types';

export interface SchemaToCliAppCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly options: SchemaToCliAppCodeOptions;
}

export interface SchemaToCliAppCodeOptions {
  readonly appsMonorepo: CodeGenerationAppsMonorepoOptions;
  readonly libModuleNames: CodeGenerationLibModuleNames;
}
