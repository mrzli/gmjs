import { SchemaToCodeAppsMonorepoOptions } from './types';

export function getSharedLibraryModuleName(
  appsMonorepo: SchemaToCodeAppsMonorepoOptions
): string {
  return `@${appsMonorepo.npmScope}/${appsMonorepo.baseProjectName}-shared`;
}

export function getSchemasDir(
  appsMonorepo: SchemaToCodeAppsMonorepoOptions
): string {
  return `${appsMonorepo.libsDir}/${appsMonorepo.baseProjectName}-data-model/assets/schemas`;
}
