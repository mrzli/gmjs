import { Project, Scope } from 'ts-morph';
import { OptionsHelper } from '../util/options-helper';
import { MongoJsonSchemaTypeObject } from '../../../data-model/mongo-json-schema';
import { camelCase, kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import {
  PLACEHOLDER_MODULE_NAME_NESTJS_COMMON,
  PLACEHOLDER_MODULE_NAME_TYPE_FEST,
} from '../util/placeholders';

export function generateRepository(
  project: Project,
  optionsHelper: OptionsHelper,
  schema: MongoJsonSchemaTypeObject,
  moduleDir: string
): void {
  const dbPrefix = optionsHelper.getDbInterfacePrefix();

  const entityFsName = kebabCase(schema.title);
  const typeName = pascalCase(schema.title);

  const dbTypeName = pascalCase(`${dbPrefix}${typeName}`);
  const dbVariableName = camelCase(`${dbPrefix}${typeName}`);

  const filePath = path.join(moduleDir, `${entityFsName}.repository.ts`);
  const sf = project.createSourceFile(filePath);

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
    name: `${typeName}Repository`,
    decorators: [{ name: 'Injectable', arguments: [] }],
    ctors: [
      {
        scope: Scope.Public,
        parameters: [
          {
            scope: Scope.Private,
            isReadonly: true,
            name: 'mongoDatabaseService',
            type: 'MongoDatabaseService',
          },
        ],
      },
    ],
    getAccessors: [
      {
        scope: Scope.Private,
        name: 'collection',
        returnType: `Collection<OptionalId<${dbTypeName}>>`,
        statements: [
          `return this.mongoDatabaseService.db.collection(DbCollectionName.${typeName});`,
        ],
      },
    ],
    methods: [
      {
        scope: Scope.Public,
        isAsync: true,
        name: 'getAll',
        returnType: `Promise<readonly ${dbTypeName}[]>`,
        statements: ['return this.collection.find({}).toArray();'],
      },
      {
        scope: Scope.Public,
        isAsync: true,
        name: 'getById',
        parameters: [
          {
            name: 'id',
            type: 'ObjectId',
          },
        ],
        returnType: `Promise<${dbTypeName} | undefined>`,
        statements: ['return this.collection.findOne({ _id: id });'],
      },
      {
        scope: Scope.Public,
        isAsync: true,
        name: 'create',
        parameters: [
          {
            name: dbVariableName,
            type: `Except<${dbTypeName}, '_id'>`,
          },
        ],
        returnType: `Promise<${dbTypeName}>`,
        statements: [
          `const { insertedId } = await this.collection.insertOne(${dbVariableName});`,
          [
            `const result = await this.collection.findOne<${dbTypeName}>({`,
            '  _id: insertedId,',
            '});',
          ].join('\n'),
          'return valueOrThrow(result);',
        ],
      },
      {
        scope: Scope.Public,
        isAsync: true,
        name: 'update',
        parameters: [
          {
            name: 'id',
            type: 'ObjectId',
          },
          {
            name: dbVariableName,
            type: `Partial<Except<${dbTypeName}, '_id'>>`,
          },
        ],
        returnType: `Promise<${dbTypeName}>`,
        statements: [
          [
            'const result = await this.collection.findOneAndUpdate(',
            '  { _id: id },',
            `  { $set: ${dbVariableName} },`,
            "  { returnDocument: 'after' }",
            ');',
          ].join('\n'),
          'return valueOrThrow(result.value);',
        ],
      },
      {
        scope: Scope.Public,
        isAsync: true,
        name: 'remove',
        parameters: [
          {
            name: 'id',
            type: 'ObjectId',
          },
        ],
        returnType: 'Promise<void>',
        statements: ['await this.collection.deleteOne({ _id: id });'],
      },
    ],
  });
}
