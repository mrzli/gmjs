import { Project, Scope } from 'ts-morph';
import { OptionsHelper } from '../util/options-helper';
import { MongoJsonSchemaTypeObject } from '../../../data-model/mongo-json-schema';
import { camelCase, kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import {
  PLACEHOLDER_MODULE_NAME_NESTJS_COMMON,
  PLACEHOLDER_MODULE_NAME_TYPE_FEST,
} from '../util/placeholders';

export function generateController(
  project: Project,
  optionsHelper: OptionsHelper,
  schema: MongoJsonSchemaTypeObject,
  moduleDir: string
): void {
  const entityFsName = kebabCase(schema.title);
  const variableName = camelCase(schema.title);
  const typeName = pascalCase(schema.title);

  const filePath = path.join(moduleDir, `${entityFsName}.controller.ts`);
  const sf = project.createSourceFile(filePath);

  const serviceVariable = `${variableName}Service`;
  const serviceType = `${typeName}Service`;

  // performance issues when not using a placeholder
  sf.addImportDeclarations([
    {
      namedImports: ['Body', 'Controller', 'Delete', 'Get', 'Param', 'Post'],
      moduleSpecifier: PLACEHOLDER_MODULE_NAME_NESTJS_COMMON,
    },
    {
      namedImports: ['Except'],
      moduleSpecifier: PLACEHOLDER_MODULE_NAME_TYPE_FEST,
      isTypeOnly: true,
    },
    {
      namedImports: [typeName],
      moduleSpecifier: optionsHelper.getSharedLibraryModuleSpecifier(),
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
        arguments: [`{ path: '${variableName}' }`],
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
        returnType: `Promise<readonly ${typeName}[]>`,
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
        returnType: `Promise<${typeName}>`,
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
            type: `Except<${typeName}, 'id'>`,
          },
        ],
        returnType: `Promise<${typeName}>`,
        statements: [`return this.${serviceVariable}.create(${variableName})`],
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
            type: `Partial<Except<${typeName}, 'id'>>`,
          },
        ],
        returnType: `Promise<${typeName}>`,
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
}
