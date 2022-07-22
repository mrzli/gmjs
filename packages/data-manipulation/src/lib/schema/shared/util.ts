import {
  CodeGenerationAppsMonorepoOptions,
  CodeGenerationLibModuleNames,
} from './types';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  AnyObject,
  compareFnStringAsc,
  objectGetEntries,
  sortArray,
} from '@gmjs/util';
import { pascalCase } from '@gmjs/lib-util';

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

export function sortSchemas(
  schemas: readonly MongoJsonSchemaTypeObject[]
): readonly MongoJsonSchemaTypeObject[] {
  return sortArray(schemas, (s1, s2) =>
    compareFnStringAsc(pascalCase(s1.title), pascalCase(s2.title))
  );
}

export function toLibModuleNameSubstitutions(
  libModuleNames: CodeGenerationLibModuleNames
): AnyObject {
  return objectGetEntries(libModuleNames).reduce((acc, entry) => {
    const moduleKey = `moduleName${pascalCase(entry.key)}`;
    return { ...acc, [moduleKey]: entry.value };
  }, {});
}
