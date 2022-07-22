import { PathContentPair } from '@gmjs/fs-util';
import { createTsSourceFile } from '../../../../shared/source-file-util';
import { camelCase, kebabCase, pascalCase } from '@gmjs/lib-util';
import { SchemaToWebActionReducerCodeInput } from '../../schema-to-web-action-reducer-code-input';
import {
  FunctionDeclarationStructure,
  ImportDeclarationStructure,
  OptionalKind,
} from 'ts-morph';

export function generateStoreHooks(
  input: SchemaToWebActionReducerCodeInput
): PathContentPair {
  const content = createTsSourceFile((sf) => {
    const entityBaseNames = input.schemas.map((schema) =>
      pascalCase(schema.title)
    );

    const importDeclarations = getImportDeclarations(entityBaseNames);
    sf.addImportDeclarations(importDeclarations);

    sf.addStatements(['\n', ...getAppStoreHookStatements(), '\n']);

    const functionDeclarations: readonly OptionalKind<FunctionDeclarationStructure>[] =
      [
        getUseStateSelectorFunctionDeclaration(),
        ...entityBaseNames.map(getEntityStateSelectorFunctionDeclaration),
      ];
    sf.addFunctions(functionDeclarations);
  });

  return {
    path: 'store/store-hooks.ts',
    content,
  };
}

function getImportDeclarations(
  entityBaseNames: readonly string[]
): readonly OptionalKind<ImportDeclarationStructure>[] {
  return [
    {
      namedImports: ['Dispatch'],
      moduleSpecifier: 'redux',
    },
    {
      namedImports: ['TypedUseSelectorHook', 'useDispatch', 'useSelector'],
      moduleSpecifier: 'react-redux',
    },
    {
      namedImports: ['AppAction'],
      moduleSpecifier: './app-action',
    },
    {
      namedImports: ['AppState'],
      moduleSpecifier: './app-reducer',
    },
    ...entityBaseNames.map(getImportDeclaration),
  ];
}

function getImportDeclaration(
  entityBaseName: string
): OptionalKind<ImportDeclarationStructure> {
  const fsName = kebabCase(entityBaseName);
  return {
    namedImports: [`${entityBaseName}State`],
    moduleSpecifier: `./${fsName}/reducer`,
  };
}

function getAppStoreHookStatements(): readonly string[] {
  return [
    'export const useAppDispatch = (): Dispatch<AppAction> => useDispatch<Dispatch<AppAction>>();',
    'export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;',
  ];
}

function getUseStateSelectorFunctionDeclaration(): OptionalKind<FunctionDeclarationStructure> {
  return {
    name: 'useStateSelector<K extends keyof AppState>',
    isExported: true,
    parameters: [{ name: 'stateName', type: 'K' }],
    returnType: 'AppState[K]',
    statements: ['return useAppSelector((state) => state[stateName]);'],
  };
}

function getEntityStateSelectorFunctionDeclaration(
  entityBaseName: string
): OptionalKind<FunctionDeclarationStructure> {
  const camelCased = camelCase(entityBaseName);

  return {
    name: `use${entityBaseName}Selector`,
    isExported: true,
    returnType: `${entityBaseName}State`,
    statements: [`return useStateSelector('${camelCased}');`],
  };
}
