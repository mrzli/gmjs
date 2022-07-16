import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';
import { ImportDeclarationStructure, OptionalKind, SourceFile } from 'ts-morph';
import { sortArrayByStringAsc } from '@gmjs/util';
import { kebabCase, pascalCase } from '@gmjs/lib-util';
import {
  appendImports,
  appendNestModuleImports,
} from '../../../shared/code-util';
import { PathContentPair } from '@gmjs/fs-util';
import { createTsSourceFile } from '../../../shared/source-file-util';

export function addEntityModulesToAppModule(
  input: SchemaToBackendAppCodeInput
): PathContentPair {
  const appModuleFilePath = 'app/app.module.ts';
  const content = createTsSourceFile((sf) => {
    const entityNames = sortArrayByStringAsc(
      input.schemas.map((schema) => schema.title)
    );

    addAppModuleImports(sf, entityNames);
    appendNestModuleImports(sf, 'AppModule', entityNames.map(getModuleName));
  }, input.initialFiles.appModule);

  return {
    path: appModuleFilePath,
    content,
  };
}

function addAppModuleImports(
  sf: SourceFile,
  entityNames: readonly string[]
): void {
  const importDeclarations: readonly OptionalKind<ImportDeclarationStructure>[] =
    entityNames.map((name) => {
      const entityFsName = kebabCase(name);
      return {
        namedImports: [getModuleName(name)],
        moduleSpecifier: `./${entityFsName}/${entityFsName}.module`,
      };
    });

  appendImports(sf, importDeclarations);
}

function getModuleName(entityName: string): string {
  return pascalCase(entityName) + 'Module';
}
