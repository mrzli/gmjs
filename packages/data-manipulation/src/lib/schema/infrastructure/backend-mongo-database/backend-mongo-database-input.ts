import {
  CodeGenerationAppsMonorepoOptions,
  CodeGenerationLibsModuleNames,
} from '../../shared/types';

export interface BackendMongoDatabaseInput {
  readonly appModuleFile: string;
  readonly options: BackendMongoDatabaseOptions;
}

export interface BackendMongoDatabaseOptions {
  readonly appMonorepo: CodeGenerationAppsMonorepoOptions;
  readonly libModuleNames: CodeGenerationLibsModuleNames;
}
