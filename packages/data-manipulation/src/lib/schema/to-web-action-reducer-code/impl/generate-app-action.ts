import { PathContentPair } from '@gmjs/fs-util';
import { createTsSourceFile } from '../../../shared/source-file-util';
import { kebabCase, pascalCase } from '@gmjs/lib-util';
import { SchemaToWebActionReducerCodeInput } from '../schema-to-web-action-reducer-code-input';
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

    const entityBaseNamesWithGeneric: readonly string[] = [
      'Generic',
      ...entityBaseNames,
    ];

    sf.addStatements([
      '\n',
      getActionTypeUnion(entityBaseNamesWithGeneric),
      '\n',
      getActionUnion(entityBaseNamesWithGeneric),
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
  return [
    {
      namedImports: ['ActionGeneric', 'ActionTypeGeneric'],
      moduleSpecifier: './generic-action',
    },
    ...entityBaseNames.map(getImportDeclaration),
  ];
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
