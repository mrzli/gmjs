import { Project, Scope } from 'ts-morph';
import { OptionsHelper } from '../util/options-helper';
import { MongoJsonSchemaTypeObject } from '../../../data-model/mongo-json-schema';
import { camelCase, kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import {
  PLACEHOLDER_MODULE_NAME_NESTJS_COMMON,
  PLACEHOLDER_MODULE_NAME_TYPE_FEST,
} from '../util/placeholders';

export function generateService(
  project: Project,
  optionsHelper: OptionsHelper,
  schema: MongoJsonSchemaTypeObject,
  moduleDir: string
): void {
  const dbPrefix = optionsHelper.getDbInterfacePrefix();

  const entityFsName = kebabCase(schema.title);
  const variableName = camelCase(schema.title);
  const typeName = pascalCase(schema.title);
  const dbTypeName = pascalCase(`${dbPrefix}${typeName}`);

  const filePath = path.join(moduleDir, `${entityFsName}.service.ts`);
  const sf = project.createSourceFile(filePath);

  const repositoryVariable = `${variableName}Repository`;
  const repositoryType = `${typeName}Repository`;

  const dbVariableName = `db${typeName}`; // fixed to 'db' does not depend on prefix
  const dbToAppMapper = `db${typeName}ToApp${typeName}`;
  const appToDbMapper = `app${typeName}ToDb${typeName}`;

  const transformIfExists = 'transformIfExists';

  // performance issues when not using a placeholder
  sf.addImportDeclarations([
    {
      namedImports: ['Injectable'],
      moduleSpecifier: PLACEHOLDER_MODULE_NAME_NESTJS_COMMON,
    },
    {
      namedImports: ['Collection', 'ObjectId', 'OptionalId'],
      moduleSpecifier: 'mongodb',
    },
    {
      namedImports: ['Except'],
      moduleSpecifier: PLACEHOLDER_MODULE_NAME_TYPE_FEST,
    },
    {
      namedImports: ['MongoDatabaseService', 'valueOrThrow'],
      moduleSpecifier: optionsHelper.getNestUtilModuleSpecifier(),
    },
    {
      namedImports: ['DbCollectionName', dbTypeName],
      moduleSpecifier: optionsHelper.getSharedLibraryModuleSpecifier(),
    },
  ]);

  sf.addClass({
    isExported: true,
    name: `${typeName}Service`,
    decorators: [{ name: 'Injectable', arguments: [] }],
    ctors: [
      {
        scope: Scope.Public,
        parameters: [
          {
            scope: Scope.Private,
            isReadonly: true,
            name: repositoryVariable,
            type: repositoryType,
          },
        ],
      },
    ],
    methods: [
      {
        scope: Scope.Public,
        isAsync: true,
        name: 'getAll',
        returnType: `Promise<readonly ${typeName}[]>`,
        statements: [
          `const ${dbVariableName}List = await this.${repositoryVariable}.getAll();`,
          `return ${dbVariableName}List.map(${dbToAppMapper})`,
        ],
      },
      {
        scope: Scope.Public,
        isAsync: true,
        name: 'getById',
        parameters: [
          {
            name: 'id',
            type: 'string',
          },
        ],
        returnType: `Promise<${typeName} | undefined>`,
        statements: [
          `const ${dbVariableName} = await this.${repositoryVariable}.getById(new ObjectId(id));`,
          `return ${transformIfExists}(${dbVariableName}, ${dbToAppMapper}, undefined);`,
        ],
      },
      {
        scope: Scope.Public,
        isAsync: true,
        name: 'create',
        parameters: [
          {
            name: variableName,
            type: `Except<${typeName}, 'id'>`,
          },
        ],
        returnType: `Promise<${typeName}>`,
        statements: [
          [
            `const ${dbVariableName} = await this.${repositoryVariable}.create(`,
            `  ${appToDbMapper}WithoutId(${variableName})`,
            ');',
          ].join('\n'),
          `return ${dbToAppMapper}(${dbVariableName});`,
        ],
      },
      {
        scope: Scope.Public,
        isAsync: true,
        name: 'update',
        parameters: [
          {
            name: 'id',
            type: 'string',
          },
          {
            name: variableName,
            type: `Partial<Except<${typeName}, 'id'>>`,
          },
        ],
        returnType: `Promise<${typeName}>`,
        statements: [
          [
            `const ${dbVariableName} = await this.${repositoryVariable}.update(`,
            '  new ObjectId(id),',
            `  ${appToDbMapper}WithoutIdPartial(${variableName})`,
            ');',
          ].join('\n'),
          `return ${dbToAppMapper}(${dbVariableName});`,
        ],
      },
      {
        scope: Scope.Public,
        isAsync: true,
        name: 'remove',
        parameters: [
          {
            name: 'id',
            type: 'string',
          },
        ],
        returnType: 'Promise<void>',
        statements: [
          `await this.${repositoryVariable}.remove(new ObjectId(id));`,
        ],
      },
    ],
  });
}
