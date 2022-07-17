import { CodeGenerationAppsMonorepoOptions } from './types';

export function getSharedLibraryModuleName(
  appsMonorepo: CodeGenerationAppsMonorepoOptions
): string {
  return `@${appsMonorepo.npmScope}/${appsMonorepo.baseProjectName}-shared`;
}

export function getSchemasDir(
  appsMonorepo: CodeGenerationAppsMonorepoOptions
): string {
  return `${appsMonorepo.libsDir}/${appsMonorepo.baseProjectName}-data-model/assets/schemas`;
}
