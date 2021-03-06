import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import { PathContentPair } from '@gmjs/fs-util';
import { SchemaToWebBackendApiCodeInput } from '../schema-to-web-backend-api-code-input';
import { casedNames } from '@gmjs/lib-util';
import {
  FunctionDeclarationStructure,
  ImportDeclarationStructure,
  InterfaceDeclarationStructure,
  OptionalKind,
  PropertySignatureStructure,
} from 'ts-morph';
import { createTsSourceFile } from '../../../shared/source-file-util';
import { sortArrayByStringAsc } from '@gmjs/util';
import { sortSchemas } from '../../shared/util';

export function generateAppApiCode(
  input: SchemaToWebBackendApiCodeInput
): PathContentPair {
  const schemas = sortSchemas(input.schemas);

  const content = createTsSourceFile((sf) => {
    const importDeclarations = getImportDeclarations(schemas);
    sf.addImportDeclarations(importDeclarations);

    const apiInterface = getApiInterfaceDeclaration(schemas);
    sf.addInterface(apiInterface);

    const createApiFunction = getCreateAppApiFunctionDeclaration(schemas);
    sf.addFunction(createApiFunction);
  });

  return {
    path: `api/app-api.ts`,
    content: content,
  };
}

function getImportDeclarations(
  schemas: readonly MongoJsonSchemaTypeObject[]
): readonly OptionalKind<ImportDeclarationStructure>[] {
  return [
    {
      namedImports: ['AxiosInstance'],
      moduleSpecifier: 'axios',
    },
    ...schemas.map(getEntityApiImportDeclaration),
  ];
}

function getEntityApiImportDeclaration(
  schema: MongoJsonSchemaTypeObject
): OptionalKind<ImportDeclarationStructure> {
  const baseNames = casedNames(schema.title);

  return {
    namedImports: [
      ...sortArrayByStringAsc([
        `${baseNames.pascalCased}Api`,
        `create${baseNames.pascalCased}Api`,
      ]),
    ],
    moduleSpecifier: `./parts/${baseNames.kebabCased}-api`,
  };
}

function getApiInterfaceDeclaration(
  schemas: readonly MongoJsonSchemaTypeObject[]
): OptionalKind<InterfaceDeclarationStructure> {
  return {
    name: 'AppApi',
    isExported: true,
    properties: schemas.map(getEntityApiInterfaceProperty),
  };
}

function getEntityApiInterfaceProperty(
  schema: MongoJsonSchemaTypeObject
): OptionalKind<PropertySignatureStructure> {
  const { pascalCased: typeName, camelCased: variableName } = casedNames(
    schema.title
  );

  return {
    name: variableName,
    isReadonly: true,
    type: `${typeName}Api`,
  };
}

function getCreateAppApiFunctionDeclaration(
  schemas: readonly MongoJsonSchemaTypeObject[]
): OptionalKind<FunctionDeclarationStructure> {
  return {
    name: `createAppApi`,
    isExported: true,
    parameters: [
      {
        name: 'server',
        type: 'AxiosInstance',
      },
    ],
    returnType: 'AppApi',
    statements: [
      (writer) => {
        writer
          .write('return')
          .inlineBlock(() => {
            for (const schema of schemas) {
              writer.writeLine(getCreateAppApiEntityPropertyAssignment(schema));
            }
          })
          .write(';');
      },
    ],
  };
}

function getCreateAppApiEntityPropertyAssignment(
  schema: MongoJsonSchemaTypeObject
): string {
  const { pascalCased: typeName, camelCased: variableName } = casedNames(
    schema.title
  );

  return `${variableName}: create${typeName}Api(server),`;
}
