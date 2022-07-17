import { Scope } from 'ts-morph';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import { camelCase, kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { createTsSourceFile } from '../../../shared/source-file-util';
import { getSharedLibraryModuleName } from '../../shared/util';

export function generateRepository(
  input: SchemaToBackendAppCodeInput,
  schema: MongoJsonSchemaTypeObject,
  moduleDir: string
): PathContentPair {
  const dbPrefix = input.options.interfacePrefixes.db;
  const libModuleNames = input.options.libModuleNames;

  const entityFsName = kebabCase(schema.title);
  const typeName = pascalCase(schema.title);

  const dbTypeName = pascalCase(`${dbPrefix}${typeName}`);
  const dbVariableName = camelCase(`${dbPrefix}${typeName}`);

  const filePath = path.join(moduleDir, `${entityFsName}.repository.ts`);

  const content = createTsSourceFile((sf) => {
    sf.addImportDeclarations([
      {
        namedImports: ['Injectable'],
        moduleSpecifier: '@nestjs/common',
      },
      {
        namedImports: ['Collection', 'ObjectId', 'OptionalId'],
        moduleSpecifier: 'mongodb',
      },
      {
        namedImports: ['DbWithoutId'],
        moduleSpecifier: libModuleNames.mongoUtil,
      },
      {
        namedImports: ['MongoDatabaseService', 'valueOrThrow'],
        moduleSpecifier: libModuleNames.nestUtil,
      },
      {
        namedImports: ['DbCollectionName', dbTypeName],
        moduleSpecifier: getSharedLibraryModuleName(input.options.appsMonorepo),
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
          statements: [
            'const result = await this.collection.findOne({ _id: id });',
            'return result ?? undefined;',
          ],
        },
        {
          scope: Scope.Public,
          isAsync: true,
          name: 'create',
          parameters: [
            {
              name: dbVariableName,
              type: `DbWithoutId<${dbTypeName}>`,
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
              type: `DbWithoutId<${dbTypeName}>`,
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
  }, undefined);

  return {
    path: filePath,
    content,
  };
}
