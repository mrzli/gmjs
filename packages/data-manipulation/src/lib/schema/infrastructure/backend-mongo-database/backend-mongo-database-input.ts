import {
  CodeGenerationAppsMonorepoOptions,
  CodeGenerationLibModuleNames,
} from '../../shared/types';

export interface BackendMongoDatabaseInput {
  readonly appModuleFile: string;
  readonly options: BackendMongoDatabaseOptions;
}

export interface BackendMongoDatabaseOptions {
  readonly appsMonorepo: CodeGenerationAppsMonorepoOptions;
  readonly libModuleNames: CodeGenerationLibModuleNames;
}
