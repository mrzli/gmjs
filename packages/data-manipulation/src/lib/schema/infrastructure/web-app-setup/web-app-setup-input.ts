import {
  CodeGenerationAppsMonorepoOptions,
  CodeGenerationInterfacePrefixes,
  CodeGenerationLibModuleNames,
} from '../../shared/types';

export interface WebAppSetupInput {
  readonly options: WebAppSetupOptions;
}

export interface WebAppSetupOptions {
  readonly appsMonorepo: CodeGenerationAppsMonorepoOptions;
  readonly libModuleNames: CodeGenerationLibModuleNames;
  readonly interfacePrefixes: CodeGenerationInterfacePrefixes;
}
