import { SchemaToWebActionReducerCodeInput } from '../../schema-to-web-action-reducer-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { getSharedLibraryModuleName, sortSchemas } from '../../../shared/util';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  ImportDeclarationStructure,
  InterfaceDeclarationStructure,
  OptionalKind,
  WriterFunction,
} from 'ts-morph';
import { casedNames } from '@gmjs/lib-util';
import { createTsSourceFile } from '../../../../shared/source-file-util';
import { sortArrayByStringAsc } from '@gmjs/util';
import {
  ActionValues,
  ApiCallActionType,
  getEndpointAllActionValues,
} from './util/util';

export function generateReducers(
  input: SchemaToWebActionReducerCodeInput
): readonly PathContentPair[] {
  const schemas = sortSchemas(input.schemas);

  return [...schemas.map((schema) => generateEntityReducer(input, schema))];
}

function generateEntityReducer(
  input: SchemaToWebActionReducerCodeInput,
  schema: MongoJsonSchemaTypeObject
): PathContentPair {
  const {
    pascalCased: entityBaseName,
    kebabCased: fsName,
    camelCased: variableName,
    constantCased: constantName,
  } = casedNames(schema.title);
  const { pascalCased: typeName } = casedNames(
    input.options.interfacePrefixes.app,
    schema.title
  );

  const allActionValues = getEndpointAllActionValues(entityBaseName, typeName);

  const content = createTsSourceFile((sf) => {
    const importDeclarations = getImportDeclarations(
      input,
      entityBaseName,
      typeName,
      allActionValues
    );
    sf.addImportDeclarations(importDeclarations);

    const stateInterfaceDeclaration = getStateInterfaceDeclaration(
      entityBaseName,
      typeName
    );
    sf.addInterface(stateInterfaceDeclaration);

    const initialStateStatement = getInitialStateStatement(
      entityBaseName,
      constantName
    );

    const reducerStatement = getReducerStatement(
      entityBaseName,
      variableName,
      constantName,
      allActionValues
    );

    sf.addStatements(['\n', initialStateStatement, '\n', reducerStatement]);
  });

  return {
    path: `store/${fsName}/reducer.ts`,
    content,
  };
}

function getImportDeclarations(
  input: SchemaToWebActionReducerCodeInput,
  entityBaseName: string,
  typeName: string,
  allActionValues: readonly ActionValues[]
): readonly OptionalKind<ImportDeclarationStructure>[] {
  const libModuleNames = input.options.libModuleNames;

  const actionImports: readonly string[] = sortArrayByStringAsc([
    ...allActionValues.map((av) => av.actionTypeConstant),
    `Action${entityBaseName}`,
  ]);

  return [
    {
      namedImports: [
        'createEmptyNormalizedItems',
        'createReducer',
        'NormalizedItems',
        'removeNormalizedItem',
        'setNormalizedItems',
        'updateNormalizedItem',
      ],
      moduleSpecifier: libModuleNames.reactUtil,
    },
    {
      namedImports: [typeName],
      moduleSpecifier: getSharedLibraryModuleName(input.options.appsMonorepo),
    },
    {
      namedImports: [...actionImports],
      moduleSpecifier: './action',
    },
  ];
}

function getStateInterfaceDeclaration(
  entityBaseName: string,
  typeName: string
): OptionalKind<InterfaceDeclarationStructure> {
  return {
    name: `${entityBaseName}State`,
    isExported: true,
    properties: [
      {
        name: 'isLoading',
        isReadonly: true,
        type: 'boolean',
      },
      {
        name: 'items',
        isReadonly: true,
        type: `NormalizedItems<${typeName}>`,
      },
    ],
  };
}

function getInitialStateStatement(
  entityBaseName: string,
  constantName: string
): WriterFunction {
  return (writer) => {
    writer
      .write(
        `export const ${constantName}_INITIAL_STATE: ${entityBaseName}State = `
      )
      .inlineBlock(() => {
        writer
          .writeLine('isLoading: false,')
          .writeLine('items: createEmptyNormalizedItems(),');
      })
      .write(';');
  };
}

function getReducerStatement(
  entityBaseName: string,
  variableName: string,
  constantName: string,
  allActionValues: readonly ActionValues[]
): WriterFunction {
  return (writer) => {
    writer
      .writeLine(
        `export const ${variableName}Reducer = createReducer<${entityBaseName}State, Action${entityBaseName}>(`
      )
      .indent(() => {
        writer
          .writeLine(`${constantName}_INITIAL_STATE,`)
          .write('(action) => (state) => ')
          .inlineBlock(() => {
            writer.write('switch (action.type) ').inlineBlock(() => {
              for (const actionValues of allActionValues) {
                const { actionTypeConstant, apiCallActionType, endpointName } =
                  actionValues;

                writer.writeLine(`case ${actionTypeConstant}:`).indent(() => {
                  switch (apiCallActionType) {
                    case 'Base':
                      break;
                    case 'Pending':
                      writer.writeLine('state.isLoading = true;');
                      break;
                    case 'Fulfilled':
                      switch (endpointName) {
                        case 'getAll':
                          writer.writeLine(
                            ' setNormalizedItems(state.items, action.payload);'
                          );
                          break;
                        case 'getById':
                          writer.writeLine(
                            ' updateNormalizedItem(state.items, action.payload);'
                          );
                          break;
                        case 'create':
                          writer.writeLine(
                            ' updateNormalizedItem(state.items, action.payload);'
                          );
                          break;
                        case 'update':
                          writer.writeLine(
                            ' updateNormalizedItem(state.items, action.payload);'
                          );
                          break;
                        case 'remove':
                          writer.writeLine(
                            ' removeNormalizedItem(state.items, action.payload);'
                          );
                          break;
                      }
                      writer.writeLine('state.isLoading = false;');
                      break;
                    case 'Rejected':
                      writer.writeLine('state.isLoading = false;');
                      break;
                  }
                  writer.writeLine('break;');
                });
              }
            });
          });
      })
      .writeLine(');');
  };
}

const ENDING_API_CALL_ACTION_TYPES: readonly ApiCallActionType[] = [
  'Fulfilled',
  'Rejected',
];
