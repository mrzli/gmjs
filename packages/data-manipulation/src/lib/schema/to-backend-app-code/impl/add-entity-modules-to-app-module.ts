import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';
import {
  ImportDeclarationStructure,
  OptionalKind,
  SourceFile,
  SyntaxKind,
} from 'ts-morph';
import { sortArrayByStringAsc } from '@gmjs/util';
import { kebabCase, pascalCase } from '@gmjs/lib-util';
import { createTsSourceFile } from '../../../shared/code-util';
import { PathContentPair } from '@gmjs/fs-util';
import {
  addImports,
  addNestModuleImports,
} from '../../../shared/ts-morph/code-modifiers';

export function addEntityModulesToAppModule(
  input: SchemaToBackendAppCodeInput
): PathContentPair {
  const appModuleFilePath = 'app/app.module.ts';
  const content = createTsSourceFile((sf) => {
    const entityNames = sortArrayByStringAsc(
      input.schemas.map((schema) => schema.title)
    );

    addAppModuleImports(sf, entityNames);
    addNestModuleImports(sf, 'AppModule', entityNames.map(getModuleName));
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

  addImports(sf, importDeclarations);
}

function getModuleName(entityName: string): string {
  return pascalCase(entityName) + 'Module';
}
