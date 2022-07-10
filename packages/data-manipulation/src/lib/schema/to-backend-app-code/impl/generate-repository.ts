import { Scope } from 'ts-morph';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import { camelCase, kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';
import {
  getNestUtilModuleSpecifier,
  getSharedLibraryModuleSpecifier,
} from './service-helpers/import-helpers';
import { PathContentPair } from '@gmjs/fs-util';
import { createTsSourceFile } from '../../../shared/source-file-util';

export function generateRepository(
  input: SchemaToBackendAppCodeInput,
  schema: MongoJsonSchemaTypeObject,
  moduleDir: string
): PathContentPair {
  const dbPrefix = input.options.dbPrefix;

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
        namedImports: ['Except'],
        moduleSpecifier: 'type-fest',
      },
      {
        namedImports: ['MongoDatabaseService', 'valueOrThrow'],
        moduleSpecifier: getNestUtilModuleSpecifier(input),
      },
      {
        namedImports: ['DbCollectionName', dbTypeName],
        moduleSpecifier: getSharedLibraryModuleSpecifier(input),
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
  }, undefined);

  return {
    path: filePath,
    content,
  };
}
