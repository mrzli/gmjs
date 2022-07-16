import { Scope } from 'ts-morph';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import { camelCase, kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { createTsSourceFile } from '../../../shared/source-file-util';
import { getSharedLibraryModuleName } from '../../shared/util';
import { MODULE_NAME_GMJS_MONGO_UTIL, MODULE_NAME_GMJS_NEST_UTIL } from '../../shared/constants';

export function generateController(
  input: SchemaToBackendAppCodeInput,
  schema: MongoJsonSchemaTypeObject,
  moduleDir: string
): PathContentPair {
  const appPrefix = input.options.interfacePrefixes.app;

  const entityFsName = kebabCase(schema.title);
  const typeName = pascalCase(schema.title);
  const variableName = camelCase(schema.title);

  const appTypeName = pascalCase(`${appPrefix}${typeName}`);

  const filePath = path.join(moduleDir, `${entityFsName}.controller.ts`);

  const serviceVariable = `${variableName}Service`;
  const serviceType = `${typeName}Service`;

  const content = createTsSourceFile((sf) => {
    sf.addImportDeclarations([
      {
        namedImports: ['Body', 'Controller', 'Delete', 'Get', 'Param', 'Post'],
        moduleSpecifier: '@nestjs/common',
      },
      {
        namedImports: ['WithoutId'],
        moduleSpecifier: MODULE_NAME_GMJS_MONGO_UTIL,
      },
      {
        namedImports: ['valueOrThrowItemNotFoundException'],
        moduleSpecifier: MODULE_NAME_GMJS_NEST_UTIL,
      },
      {
        namedImports: [appTypeName],
        moduleSpecifier: getSharedLibraryModuleName(input.options.appsMonorepo),
      },
      {
        namedImports: [serviceType],
        moduleSpecifier: `./${entityFsName}.service`,
      },
    ]);

    sf.addClass({
      isExported: true,
      name: `${typeName}Controller`,
      decorators: [
        {
          name: 'Controller',
          arguments: [`{ path: '${entityFsName}' }`],
        },
      ],
      ctors: [
        {
          scope: Scope.Public,
          parameters: [
            {
              scope: Scope.Private,
              isReadonly: true,
              name: serviceVariable,
              type: serviceType,
            },
          ],
        },
      ],
      methods: [
        {
          decorators: [
            {
              name: 'Get',
              arguments: ["'/find-all'"],
            },
          ],
          scope: Scope.Public,
          isAsync: true,
          name: 'getAll',
          returnType: `Promise<readonly ${appTypeName}[]>`,
          statements: [`return this.${serviceVariable}.getAll();`],
        },
        {
          decorators: [
            {
              name: 'Get',
              arguments: ["'/find/:id'"],
            },
          ],
          scope: Scope.Public,
          isAsync: true,
          name: 'getById',
          parameters: [
            {
              decorators: [
                {
                  name: 'Param',
                  arguments: ["'id'"],
                },
              ],
              name: 'id',
              type: 'string',
            },
          ],
          returnType: `Promise<${appTypeName}>`,
          statements: [
            `const result = await this.${serviceVariable}.getById(id);`,
            'return valueOrThrowItemNotFoundException(result, id);',
          ],
        },
        {
          decorators: [
            {
              name: 'Post',
              arguments: ["'/create'"],
            },
          ],
          scope: Scope.Public,
          isAsync: true,
          name: 'create',
          parameters: [
            {
              decorators: [
                {
                  name: 'Body',
                  arguments: [],
                },
              ],
              name: variableName,
              type: `WithoutId<${appTypeName}>`,
            },
          ],
          returnType: `Promise<${appTypeName}>`,
          statements: [
            `return this.${serviceVariable}.create(${variableName})`,
          ],
        },
        {
          decorators: [
            {
              name: 'Post',
              arguments: ["'/update/:id'"],
            },
          ],
          scope: Scope.Public,
          isAsync: true,
          name: 'update',
          parameters: [
            {
              decorators: [
                {
                  name: 'Param',
                  arguments: ["'id'"],
                },
              ],
              name: 'id',
              type: 'string',
            },
            {
              decorators: [
                {
                  name: 'Body',
                  arguments: [],
                },
              ],
              name: variableName,
              type: `WithoutId<${appTypeName}>`,
            },
          ],
          returnType: `Promise<${appTypeName}>`,
          statements: [
            `return this.${serviceVariable}.update(id, ${variableName})`,
          ],
        },
        {
          decorators: [
            {
              name: 'Delete',
              arguments: ["'/remove/:id'"],
            },
          ],
          scope: Scope.Public,
          isAsync: true,
          name: 'remove',
          parameters: [
            {
              decorators: [
                {
                  name: 'Param',
                  arguments: ["'id'"],
                },
              ],
              name: 'id',
              type: 'string',
            },
          ],
          returnType: 'Promise<void>',
          statements: [`await this.${serviceVariable}.remove(id);`],
        },
      ],
    });
  }, undefined);

  return {
    path: filePath,
    content,
  };
}
