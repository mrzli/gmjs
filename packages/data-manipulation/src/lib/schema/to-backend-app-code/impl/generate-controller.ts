import { Scope } from 'ts-morph';
import { MongoJsonSchemaTypeObject } from '../../../shared/mongo-json-schema';
import { camelCase, kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import {
  PLACEHOLDER_MAP,
  PLACEHOLDER_MODULE_NAME_NESTJS_COMMON,
  PLACEHOLDER_MODULE_NAME_TYPE_FEST,
} from './placeholders';
import { CodeFileResult, createTsSourceFile } from '../../shared/code-util';
import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';
import { getSharedLibraryModuleSpecifier } from './service-helpers/import-helpers';

export function generateController(
  input: SchemaToBackendAppCodeInput,
  schema: MongoJsonSchemaTypeObject,
  moduleDir: string
): CodeFileResult {
  const appPrefix = input.options.appPrefix;

  const entityFsName = kebabCase(schema.title);
  const typeName = pascalCase(schema.title);
  const variableName = camelCase(schema.title);

  const appTypeName = pascalCase(`${appPrefix}${typeName}`);

  const filePath = path.join(moduleDir, `${entityFsName}.controller.ts`);

  const serviceVariable = `${variableName}Service`;
  const serviceType = `${typeName}Service`;

  const content = createTsSourceFile(
    (sf) => {
      // performance issues when not using a placeholder
      sf.addImportDeclarations([
        {
          namedImports: [
            'Body',
            'Controller',
            'Delete',
            'Get',
            'Param',
            'Post',
          ],
          moduleSpecifier: PLACEHOLDER_MODULE_NAME_NESTJS_COMMON,
        },
        {
          namedImports: ['Except'],
          moduleSpecifier: PLACEHOLDER_MODULE_NAME_TYPE_FEST,
          isTypeOnly: true,
        },
        {
          namedImports: [appTypeName],
          moduleSpecifier: getSharedLibraryModuleSpecifier(input),
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
            statements: [`return this.${serviceVariable}.getById(id);`],
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
                type: `Except<${appTypeName}, 'id'>`,
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
                type: `Partial<Except<${appTypeName}, 'id'>>`,
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
    },
    undefined,
    PLACEHOLDER_MAP
  );

  return {
    path: filePath,
    content,
  };
}
