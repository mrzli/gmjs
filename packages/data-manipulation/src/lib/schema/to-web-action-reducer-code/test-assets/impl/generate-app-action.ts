import { PathContentPair } from '@gmjs/fs-util';
import { createTsSourceFile } from '@gmjs/data-manipulation';
import { kebabCase, pascalCase } from '@gmjs/lib-util';
import { SchemaToWebActionReducerCodeInput } from '../../schema-to-web-action-reducer-code-input';
import { ACTION_PREFIX, ACTION_TYPE_PREFIX } from './util/util';
import { ImportDeclarationStructure, OptionalKind } from 'ts-morph';
import { sortArrayByStringAsc } from '@gmjs/util';

export function generateAppAction(
  input: SchemaToWebActionReducerCodeInput
): PathContentPair {
  const content = createTsSourceFile((sf) => {
    const entityBaseNames = input.schemas.map((schema) =>
      pascalCase(schema.title)
    );

    const importDeclarations = getImportDeclarations(entityBaseNames);
    sf.addImportDeclarations(importDeclarations);

    sf.addStatements([
      '\n',
      getActionTypeUnion(entityBaseNames),
      '\n',
      getActionUnion(entityBaseNames),
    ]);
  });

  return {
    path: 'store/app-action.ts',
    content,
  };
}

function getImportDeclarations(
  entityBaseNames: readonly string[]
): readonly OptionalKind<ImportDeclarationStructure>[] {
  return entityBaseNames.map(getImportDeclaration);
}

function getImportDeclaration(
  entityBaseName: string
): OptionalKind<ImportDeclarationStructure> {
  const fsName = kebabCase(entityBaseName);
  const namedImports = sortArrayByStringAsc([
    `${ACTION_TYPE_PREFIX}${entityBaseName}`,
    `${ACTION_PREFIX}${entityBaseName}`,
  ]);

  return {
    namedImports: [...namedImports],
    moduleSpecifier: `./${fsName}/action`,
  };
}

function getActionTypeUnion(entityBaseNames: readonly string[]): string {
  const union = entityBaseNames
    .map((name) => `${ACTION_TYPE_PREFIX}${name}`)
    .join(' | ');
  return `export type AppActionType = ${union};`;
}

function getActionUnion(entityBaseNames: readonly string[]): string {
  const union = entityBaseNames
    .map((name) => `${ACTION_PREFIX}${name}`)
    .join(' | ');
  return `export type AppAction = ${union};`;
}
