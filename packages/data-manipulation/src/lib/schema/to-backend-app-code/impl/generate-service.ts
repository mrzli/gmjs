import { FunctionDeclarationStructure, OptionalKind, Scope } from 'ts-morph';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import { camelCase, kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import { schemaToCollectionStructure } from '../../../shared/collection-structure/mongo-collection-structure-util';
import {
  MongoCollectionStructure,
  MongoEntityStructure,
} from '../../../shared/collection-structure/mongo-collection-structure';
import { compareFnStringAsc, sortArray } from '@gmjs/util';
import {
  getMongoImports,
  getSharedLibraryInterfaceImports,
} from './service-helpers/import-helpers';
import {
  OBJECT_REMOVE_UNDEFINED_FN_NAME,
  TRANSFORM_IF_EXISTS_FN_NAME,
} from './service-helpers/constants';
import {
  createDbToAppMapperFunctionDeclaration,
  getDbToAppMapperFunctionName,
} from './service-helpers/db-to-app-mapping-helpers';
import {
  createAppToDbMapperFunctionDeclaration,
  createAppToDbMapperMainCollectionFunctionDeclaration,
  createAppToDbWithoutIdMapperFunctionDeclaration,
  getAppToDbMapperFunctionName,
} from './service-helpers/app-to-db-mapping-helpers';
import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { createTsSourceFile } from '../../../shared/source-file-util';
import { getSharedLibraryModuleName } from '../../shared/util';
import { MODULE_NAME_GMJS_MONGO_UTIL, MODULE_NAME_GMJS_UTIL } from '../../shared/constants';

export function generateService(
  input: SchemaToBackendAppCodeInput,
  schema: MongoJsonSchemaTypeObject,
  moduleDir: string
): PathContentPair {
  const collectionStructure = schemaToCollectionStructure(schema);
  const dbPrefix = input.options.interfacePrefixes.db;
  const appPrefix = input.options.interfacePrefixes.app;

  const collectionEntityName = collectionStructure.collectionType.name;

  const entityFsName = kebabCase(collectionEntityName);
  const typeName = pascalCase(collectionEntityName);
  const variableName = camelCase(collectionEntityName);

  const dbVariableName = camelCase(`${dbPrefix}${typeName}`);
  const appTypeName = pascalCase(`${appPrefix}${typeName}`);
  const appVariableName = camelCase(`${appPrefix}${typeName}`);

  const filePath = path.join(moduleDir, `${entityFsName}.service.ts`);

  const repositoryVariable = `${variableName}Repository`;
  const repositoryType = `${typeName}Repository`;

  const dbToAppMapper = getDbToAppMapperFunctionName(typeName);
  const appToDbMapper = getAppToDbMapperFunctionName(typeName);

  const content = createTsSourceFile((sf) => {
    sf.addImportDeclarations([
      {
        namedImports: ['Injectable'],
        moduleSpecifier: '@nestjs/common',
      },
      {
        namedImports: [...getMongoImports(collectionStructure)],
        moduleSpecifier: 'mongodb',
      },
      {
        namedImports: ['DbWithoutId', 'WithoutId'],
        moduleSpecifier: MODULE_NAME_GMJS_MONGO_UTIL,
      },
      {
        namedImports: [
          OBJECT_REMOVE_UNDEFINED_FN_NAME,
          TRANSFORM_IF_EXISTS_FN_NAME,
        ],
        moduleSpecifier: MODULE_NAME_GMJS_UTIL,
      },
      {
        namedImports: [
          ...getSharedLibraryInterfaceImports(
            collectionStructure,
            dbPrefix,
            appPrefix
          ),
        ],
        moduleSpecifier: getSharedLibraryModuleName(input.options.appsMonorepo),
      },
      {
        namedImports: [repositoryType],
        moduleSpecifier: `./${entityFsName}.repository`,
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
          returnType: `Promise<readonly ${appTypeName}[]>`,
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
          returnType: `Promise<${appTypeName} | undefined>`,
          statements: [
            `const ${dbVariableName} = await this.${repositoryVariable}.getById(new ObjectId(id));`,
            `return ${TRANSFORM_IF_EXISTS_FN_NAME}(${dbVariableName}, ${dbToAppMapper}, undefined);`,
          ],
        },
        {
          scope: Scope.Public,
          isAsync: true,
          name: 'create',
          parameters: [
            {
              name: appVariableName,
              type: `WithoutId<${appTypeName}>`,
            },
          ],
          returnType: `Promise<${appTypeName}>`,
          statements: [
            [
              `const ${dbVariableName} = await this.${repositoryVariable}.create(`,
              `  ${appToDbMapper}WithoutId(${appVariableName})`,
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
              name: appVariableName,
              type: `WithoutId<${appTypeName}>`,
            },
          ],
          returnType: `Promise<${appTypeName}>`,
          statements: [
            [
              `const ${dbVariableName} = await this.${repositoryVariable}.update(`,
              '  new ObjectId(id),',
              `  ${appToDbMapper}WithoutId(${appVariableName})`,
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

    const mapperFunctionDeclarations = createMapperFunctionDeclarations(
      collectionStructure,
      dbPrefix,
      appPrefix
    );
    sf.addFunctions(mapperFunctionDeclarations);
  }, undefined);

  return {
    path: filePath,
    content,
  };
}

function createMapperFunctionDeclarations(
  collectionStructure: MongoCollectionStructure,
  dbPrefix: string,
  appPrefix: string
): readonly OptionalKind<FunctionDeclarationStructure>[] {
  const embeddedEntities: readonly MongoEntityStructure[] = sortArray(
    collectionStructure.embeddedTypes,
    (item1, item2) => compareFnStringAsc(item1.name, item2.name)
  );

  const allEntities: readonly MongoEntityStructure[] = [
    collectionStructure.collectionType,
    ...embeddedEntities,
  ];

  return [
    ...allEntities.map((entity) =>
      createDbToAppMapperFunctionDeclaration(entity, dbPrefix, appPrefix)
    ),
    createAppToDbMapperMainCollectionFunctionDeclaration(
      collectionStructure.collectionType.name,
      dbPrefix,
      appPrefix
    ),
    createAppToDbWithoutIdMapperFunctionDeclaration(
      collectionStructure.collectionType,
      dbPrefix,
      appPrefix
    ),
    ...embeddedEntities.map((entity) =>
      createAppToDbMapperFunctionDeclaration(entity, dbPrefix, appPrefix)
    ),
  ];
}
