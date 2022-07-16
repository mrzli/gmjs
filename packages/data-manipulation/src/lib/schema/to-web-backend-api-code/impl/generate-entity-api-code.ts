import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import { PathContentPair } from '@gmjs/fs-util';
import { SchemaToWebBackendApiCodeInput } from '../schema-to-web-backend-api-code-input';
import { CasedNames, casedNames } from '@gmjs/lib-util';
import {
  FunctionDeclarationStructure,
  ImportDeclarationStructure,
  InterfaceDeclarationStructure,
  OptionalKind,
} from 'ts-morph';
import {
  createTsSourceFile,
  MODULE_NAME_GMJS_MONGO_UTIL,
  MODULE_NAME_GMJS_UTIL,
} from '@gmjs/data-manipulation';
import { getSharedLibraryModuleName } from '../../shared/util';

export function generateEntityApiCode(
  input: SchemaToWebBackendApiCodeInput,
  schema: MongoJsonSchemaTypeObject
): PathContentPair {
  const baseNames = casedNames(schema.title);
  const prefixedNames = casedNames(
    input.options.interfacePrefixes.app,
    schema.title
  );

  const content = createTsSourceFile((sf) => {
    const importDeclarations = getImportDeclarations(input, prefixedNames);
    sf.addImportDeclarations(importDeclarations);

    const apiInterface = getApiInterfaceDeclaration(
      input,
      baseNames,
      prefixedNames
    );
    sf.addInterface(apiInterface);

    const createApiFunction = getCreateApiFunctionDeclaration(
      input,
      baseNames,
      prefixedNames
    );
    sf.addFunction(createApiFunction);
  });

  return {
    path: `api/parts/${baseNames.kebabCased}-api.ts`,
    content: content,
  };
}

function getImportDeclarations(
  input: SchemaToWebBackendApiCodeInput,
  prefixedNames: CasedNames
): readonly OptionalKind<ImportDeclarationStructure>[] {
  return [
    {
      namedImports: ['AxiosInstance'],
      moduleSpecifier: 'axios',
    },
    {
      namedImports: ['objectOmitFields'],
      moduleSpecifier: MODULE_NAME_GMJS_UTIL,
    },
    {
      namedImports: ['WithoutId'],
      moduleSpecifier: MODULE_NAME_GMJS_MONGO_UTIL,
    },
    {
      namedImports: [prefixedNames.pascalCased],
      moduleSpecifier: getSharedLibraryModuleName(input.options.appsMonorepo),
    },
  ];
}

function getApiInterfaceDeclaration(
  input: SchemaToWebBackendApiCodeInput,
  baseNames: CasedNames,
  prefixedNames: CasedNames
): OptionalKind<InterfaceDeclarationStructure> {
  const { pascalCased: typeName, camelCased: variableName } = prefixedNames;

  return {
    name: `${baseNames.pascalCased}Api`,
    isExported: true,
    properties: [
      {
        name: 'getAll',
        isReadonly: true,
        type: `() => Promise<readonly ${typeName}[]>`,
      },
      {
        name: 'getById',
        isReadonly: true,
        type: `(id: string) => Promise<${typeName}>`,
      },
      {
        name: 'create',
        isReadonly: true,
        type: `(${variableName}: WithoutId<${typeName}>) => Promise<${typeName}>`,
      },
      {
        name: 'update',
        isReadonly: true,
        type: `(${variableName}: ${typeName}) => Promise<${typeName}>`,
      },
      {
        name: 'remove',
        isReadonly: true,
        type: `(id: string) => Promise<void>`,
      },
    ],
  };
}

function getCreateApiFunctionDeclaration(
  input: SchemaToWebBackendApiCodeInput,
  baseNames: CasedNames,
  prefixedNames: CasedNames
): OptionalKind<FunctionDeclarationStructure> {
  const { kebabCased: fsName } = baseNames;
  const { pascalCased: typeName, camelCased: variableName } = prefixedNames;

  return {
    name: `create${baseNames.pascalCased}Api`,
    isExported: true,
    parameters: [
      {
        name: 'server',
        type: 'AxiosInstance',
      },
    ],
    returnType: `${baseNames.pascalCased}Api`,
    statements: [
      (writer) => {
        writer
          .write('return')
          .inlineBlock(() => {
            writer
              .write(`async getAll(): Promise<readonly ${typeName}[]>`)
              .inlineBlock(() => {
                writer
                  .writeLine(
                    `const response = await server.get<readonly ${typeName}[]>('api/${fsName}/find-all');`
                  )
                  .writeLine('return response.data;');
              })
              .writeLine(',')
              .write(`async getById(id: string): Promise<${typeName}>`)
              .inlineBlock(() => {
                writer
                  .writeLine(
                    `const response = await server.get<${typeName}>(\`api/${fsName}/find/\$\{id\}\`);`
                  )
                  .writeLine('return response.data;');
              })
              .writeLine(',')
              .write(
                `async create(${variableName}: WithoutId<${typeName}>): Promise<${typeName}>`
              )
              .inlineBlock(() => {
                writer
                  .writeLine(
                    `const response = await server.post<${typeName}>('api/${fsName}/create', ${variableName});`
                  )
                  .writeLine('return response.data;');
              })
              .writeLine(',')
              .write(
                `async update(${variableName}: ${typeName}): Promise<${typeName}>`
              )
              .inlineBlock(() => {
                writer
                  .writeLine(
                    `const response = await server.post<${typeName}>(\`api/${fsName}/update/\$\{${variableName}.id\}\`, objectOmitFields(${variableName}, ['id']));`
                  )
                  .writeLine('return response.data;');
              })
              .writeLine(',')
              .write(`async remove(id: string): Promise<void>`)
              .inlineBlock(() => {
                writer.writeLine(
                  `await server.delete<${typeName}>(\`api/${fsName}/update/\$\{id\}\`);`
                );
              })
              .writeLine(',');
          })
          .write(';');
      },
    ],
  };
}
