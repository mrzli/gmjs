import { PathContentPair } from '@gmjs/fs-util';
import { createTsSourceFile } from '@gmjs/data-manipulation';
import { camelCase, casedNames, pascalCase } from '@gmjs/lib-util';
import { SchemaToWebActionReducerCodeInput } from '../../schema-to-web-action-reducer-code-input';
import {
  ImportDeclarationStructure,
  InterfaceDeclarationStructure,
  OptionalKind,
  WriterFunction,
} from 'ts-morph';
import { sortArrayByStringAsc } from '@gmjs/util';

export function generateAppReducer(
  input: SchemaToWebActionReducerCodeInput
): PathContentPair {
  const content = createTsSourceFile((sf) => {
    const entityBaseNames = input.schemas.map((schema) =>
      pascalCase(schema.title)
    );

    const importDeclarations = getImportDeclarations(entityBaseNames);
    sf.addImportDeclarations(importDeclarations);

    const appStateInterfaceDeclaration =
      getAppStateInterfaceDeclaration(entityBaseNames);
    sf.addInterface(appStateInterfaceDeclaration);

    sf.addStatements([
      '\n',
      getAppReducerStatement(entityBaseNames),
      '\n',
      getAppInitialStateStatement(entityBaseNames),
    ]);
  });

  return {
    path: 'store/app-reducer.ts',
    content,
  };
}

function getImportDeclarations(
  entityBaseNames: readonly string[]
): readonly OptionalKind<ImportDeclarationStructure>[] {
  return [
    {
      namedImports: ['Reducer'],
      moduleSpecifier: 'redux',
    },
    {
      namedImports: ['AppAction'],
      moduleSpecifier: './app-action',
    },
    ...entityBaseNames.map(getImportDeclaration),
  ];
}

function getImportDeclaration(
  entityBaseName: string
): OptionalKind<ImportDeclarationStructure> {
  const {
    kebabCased: fsName,
    constantCased,
    pascalCased,
    camelCased,
  } = casedNames(entityBaseName);
  const namedImports = sortArrayByStringAsc([
    `${constantCased}_INITIAL_STATE`,
    `${camelCased}Reducer`,
    `${pascalCased}State`,
  ]);

  return {
    namedImports: [...namedImports],
    moduleSpecifier: `./${fsName}/reducer`,
  };
}

function getAppStateInterfaceDeclaration(
  entityBaseNames: readonly string[]
): OptionalKind<InterfaceDeclarationStructure> {
  return {
    name: 'AppState',
    isExported: true,
    properties: entityBaseNames.map((name) => ({
      name: camelCase(name),
      isReadonly: true,
      type: `${name}State`,
    })),
  };
}

function getAppReducerStatement(
  entityBaseNames: readonly string[]
): WriterFunction {
  return (writer) => {
    writer
      .write('export const APP_REDUCER = ')
      .inlineBlock(() => {
        for (const name of entityBaseNames) {
          const camelCased = camelCase(name);
          writer.writeLine(`${camelCased}: ${camelCased}Reducer,`);
        }
      })
      .write(' as unknown as Reducer<AppState, AppAction>;');
  };
}

function getAppInitialStateStatement(
  entityBaseNames: readonly string[]
): WriterFunction {
  return (writer) => {
    writer
      .write('export const APP_INITIAL_STATE: AppState = ')
      .inlineBlock(() => {
        for (const name of entityBaseNames) {
          const { camelCased, constantCased } = casedNames(name);
          writer.writeLine(`${camelCased}: ${constantCased}_INITIAL_STATE,`);
        }
      })
      .write(';');
  };
}
