import { SchemaToWebActionReducerCodeInput } from '../../schema-to-web-action-reducer-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { getSharedLibraryModuleName, sortSchemas } from '../../../shared/util';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  FunctionDeclarationStructure,
  ImportDeclarationStructure,
  OptionalKind,
  ParameterDeclarationStructure,
  WriterFunction,
} from 'ts-morph';
import { casedNames, constantCase, pascalCase } from '@gmjs/lib-util';
import { createTsSourceFile } from '../../../../shared/source-file-util';
import { flatMap } from '@gmjs/util';

export function generateActions(
  input: SchemaToWebActionReducerCodeInput
): readonly PathContentPair[] {
  const schemas = sortSchemas(input.schemas);

  return [...schemas.map((schema) => generateEntityAction(input, schema))];
}

function generateEntityAction(
  input: SchemaToWebActionReducerCodeInput,
  schema: MongoJsonSchemaTypeObject
): PathContentPair {
  const { pascalCased: entityBaseName, kebabCased: fsName } = casedNames(
    schema.title
  );
  const { pascalCased: typeName } = casedNames(
    input.options.interfacePrefixes.app,
    schema.title
  );

  const content = createTsSourceFile((sf) => {
    const importDeclarations = getImportDeclarations(input, typeName);
    sf.addImportDeclarations(importDeclarations);

    const endpointList = getEndpointList(typeName);

    const actionDefinitions: readonly ActionDefinition[] = flatMap(
      endpointList,
      (ed) => getEndpointAllActionDefinitions(entityBaseName, typeName, ed)
    );

    for (const actionDefinition of actionDefinitions) {
      sf.addStatements(['\n', actionDefinition.typeDefinitions]);
      sf.addFunction(actionDefinition.constructorFunction);
    }

    sf.addStatements([
      '\n',
      getEntityActionTypeUnion(
        entityBaseName,
        actionDefinitions.map((ad) => ad.actionTypeName)
      ),
      '\n',
      getEntityActionUnion(
        entityBaseName,
        actionDefinitions.map((ad) => ad.actionName)
      ),
    ]);
  });

  return {
    path: `store/${fsName}/action.ts`,
    content,
  };
}

function getImportDeclarations(
  input: SchemaToWebActionReducerCodeInput,
  typeName: string
): readonly OptionalKind<ImportDeclarationStructure>[] {
  const libModuleNames = input.options.libModuleNames;

  return [
    {
      namedImports: ['AppActionBase'],
      moduleSpecifier: libModuleNames.reactUtil,
    },
    {
      namedImports: ['WithoutId'],
      moduleSpecifier: libModuleNames.mongoUtil,
    },
    {
      namedImports: [typeName],
      moduleSpecifier: getSharedLibraryModuleName(input.options.appsMonorepo),
    },
  ];
}

interface EndpointData {
  readonly name: string;
  readonly inputType: string;
  readonly returnType: string;
}

function getEndpointList(typeName: string): readonly EndpointData[] {
  return [
    {
      name: 'getAll',
      inputType: 'undefined',
      returnType: `readonly ${typeName}[]`,
    },
    {
      name: 'getById',
      inputType: 'string',
      returnType: typeName,
    },
    {
      name: 'create',
      inputType: `WithoutId<${typeName}>`,
      returnType: typeName,
    },
    {
      name: 'update',
      inputType: typeName,
      returnType: typeName,
    },
    {
      name: 'remove',
      inputType: 'string',
      returnType: 'undefined',
    },
  ];
}

const API_CALL_ACTION_TYPE_LIST = [
  'Base',
  'Pending',
  'Fulfilled',
  'Rejected',
] as const;

type ApiCallActionType = typeof API_CALL_ACTION_TYPE_LIST[number];

interface ActionDefinition {
  readonly typeDefinitions: WriterFunction;
  readonly constructorFunction: OptionalKind<FunctionDeclarationStructure>;
  readonly actionTypeName: string;
  readonly actionName: string;
}

function getEndpointAllActionDefinitions(
  entityBaseName: string,
  typeName: string,
  endpointData: EndpointData
): readonly ActionDefinition[] {
  return API_CALL_ACTION_TYPE_LIST.map((acActionType) =>
    getEndpointSingleActionDefinition(
      entityBaseName,
      typeName,
      endpointData,
      acActionType
    )
  );
}

function getEndpointSingleActionDefinition(
  entityBaseName: string,
  typeName: string,
  endpointData: EndpointData,
  apiCallActionType: ApiCallActionType
): ActionDefinition {
  const actionTypeConstant = getActionTypeConstant(
    entityBaseName,
    endpointData.name,
    apiCallActionType
  );

  const actionBaseName = casedNames(
    entityBaseName,
    endpointData.name
  ).pascalCased;
  const typeSuffix = getApiCallActionTypeSuffix(apiCallActionType);
  const actionNameWithSuffix = casedNames(
    actionBaseName,
    typeSuffix
  ).pascalCased;
  const actionTypeName = `ActionType${actionNameWithSuffix}`;
  const actionName = `Action${actionNameWithSuffix}`;
  const functionName = `action${actionNameWithSuffix}`;

  const payloadType = getPayloadType(endpointData, apiCallActionType);

  const typeDefinitions: WriterFunction = (writer) => {
    writer
      .writeLine(
        `export const ${actionTypeConstant} = '${actionNameWithSuffix}';`
      )
      .writeLine(
        `export type ${actionTypeName} = typeof ${actionTypeConstant};`
      )
      .writeLine(
        `export type ${actionName} = AppActionBase<${actionTypeName}, ${payloadType}>`
      );
  };

  const hasPayload = payloadType !== 'undefined';

  const parameters: OptionalKind<ParameterDeclarationStructure>[] = [];
  if (hasPayload) {
    parameters.push({
      name: 'payload',
      type: payloadType,
    });
  }

  const constructorFunction: OptionalKind<FunctionDeclarationStructure> = {
    name: functionName,
    isExported: true,
    parameters,
    returnType: actionName,
    statements: [
      (writer) => {
        writer
          .write('return')
          .inlineBlock(() => {
            writer
              .write(`type: ${actionTypeConstant},`)
              .conditionalWrite(hasPayload, 'payload,')
              .conditionalWrite(!hasPayload, 'payload: undefined,');
          })
          .write(';');
      },
    ],
  };

  return {
    typeDefinitions,
    constructorFunction,
    actionTypeName,
    actionName,
  };
}

function getActionTypeConstant(
  entityBaseName: string,
  actionEndpointName: string,
  apiCallActionType: ApiCallActionType
): string {
  const suffix = getApiCallActionConstantSuffix(apiCallActionType);
  return casedNames('ACTION_TYPE', entityBaseName, actionEndpointName, suffix)
    .constantCased;
}

function getApiCallActionConstantSuffix(type: ApiCallActionType): string {
  return type === 'Base' ? '' : constantCase(type);
}

function getApiCallActionTypeSuffix(type: ApiCallActionType): string {
  return type === 'Base' ? '' : pascalCase(type);
}

function getPayloadType(
  endpointData: EndpointData,
  apiCallActionType: ApiCallActionType
): string {
  switch (apiCallActionType) {
    case 'Base':
      return endpointData.inputType;
    case 'Pending':
      return 'undefined';
    case 'Fulfilled':
      return endpointData.returnType;
    case 'Rejected':
      return 'undefined';
  }
}

function getEntityActionTypeUnion(
  baseEntityName: string,
  actionTypes: readonly string[]
): string {
  const union = actionTypes.join(' | ');
  return `export type ActionType${baseEntityName} = ${union};`;
}

function getEntityActionUnion(
  baseEntityName: string,
  actions: readonly string[]
): string {
  const union = actions.join(' | ');
  return `export type Action${baseEntityName} = ${union};`;
}
