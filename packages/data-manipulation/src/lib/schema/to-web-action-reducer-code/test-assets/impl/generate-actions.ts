import { SchemaToWebActionReducerCodeInput } from '../../schema-to-web-action-reducer-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { getSharedLibraryModuleName, sortSchemas } from '../../../shared/util';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  FunctionDeclarationStructure,
  ImportDeclarationStructure,
  OptionalKind,
  ParameterDeclarationStructure,
} from 'ts-morph';
import { casedNames } from '@gmjs/lib-util';
import { createTsSourceFile } from '../../../../shared/source-file-util';
import {
  ACTION_PREFIX,
  ACTION_TYPE_PREFIX,
  ActionValues,
  getEndpointAllActionValues,
} from './util/util';

export function generateActions(
  input: SchemaToWebActionReducerCodeInput
): readonly PathContentPair[] {
  const schemas = sortSchemas(input.schemas);
  return schemas.map((schema) => generateEntityAction(input, schema));
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

    const allActionValues = getEndpointAllActionValues(
      entityBaseName,
      typeName
    );

    for (const actionValues of allActionValues) {
      const actionDefinitions = getSingleActionDefinitions(actionValues);
      sf.addStatements(['\n', ...actionDefinitions]);
      const actionFunction = getSingleActionCreateFunction(actionValues);
      sf.addFunction(actionFunction);
    }

    sf.addStatements([
      '\n',
      getEntityActionTypeUnion(
        entityBaseName,
        allActionValues.map((av) => av.actionTypeName)
      ),
      '\n',
      getEntityActionUnion(
        entityBaseName,
        allActionValues.map((av) => av.actionName)
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

function getSingleActionDefinitions(
  actionValues: ActionValues
): readonly string[] {
  const {
    actionTypeStringValue,
    actionTypeConstant,
    actionTypeName,
    actionName,
    payloadType,
  } = actionValues;

  return [
    `export const ${actionTypeConstant} = '${actionTypeStringValue}';`,
    `export type ${actionTypeName} = typeof ${actionTypeConstant};`,
    `export type ${actionName} = AppActionBase<${actionTypeName}, ${payloadType}>`,
  ];
}

function getSingleActionCreateFunction(
  actionValues: ActionValues
): OptionalKind<FunctionDeclarationStructure> {
  const {
    actionTypeConstant,
    actionName,
    actionCreateFunctionName,
    payloadType,
  } = actionValues;

  const hasPayload = payloadType !== 'undefined';

  const parameters: OptionalKind<ParameterDeclarationStructure>[] = [];
  if (hasPayload) {
    parameters.push({
      name: 'payload',
      type: payloadType,
    });
  }

  return {
    name: actionCreateFunctionName,
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
}

function getEntityActionTypeUnion(
  entityBaseName: string,
  actionTypes: readonly string[]
): string {
  const union = actionTypes.join(' | ');
  return `export type ${ACTION_TYPE_PREFIX}${entityBaseName} = ${union};`;
}

function getEntityActionUnion(
  entityBaseName: string,
  actions: readonly string[]
): string {
  const union = actions.join(' | ');
  return `export type ${ACTION_PREFIX}${entityBaseName} = ${union};`;
}
