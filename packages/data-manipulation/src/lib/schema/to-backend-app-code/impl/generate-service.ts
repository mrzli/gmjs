import { FunctionDeclarationStructure, OptionalKind, Scope } from 'ts-morph';
import { MongoJsonSchemaTypeObject } from '../../../shared/mongo-json-schema';
import { camelCase, kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import {
  PLACEHOLDER_MAP,
  PLACEHOLDER_MODULE_NAME_NESTJS_COMMON,
  PLACEHOLDER_MODULE_NAME_TYPE_FEST,
} from './placeholders';
import { schemaToCollectionStructure } from '../../shared/collection-structure/mongo-collection-structure-util';
import {
  MongoCollectionStructure,
  MongoEntityStructure,
} from '../../shared/collection-structure/mongo-collection-structure';
import { compareFnStringAsc, sortArray } from '@gmjs/util';
import {
  getMongoImports,
  getSharedLibraryInterfaceImports,
  getSharedLibraryModuleSpecifier,
  getUtilModuleSpecifier,
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
  createAppToDbWithoutIdPartialMapperFunctionDeclaration,
  getAppToDbMapperFunctionName,
} from './service-helpers/app-to-db-mapping-helpers';
import { CodeFileResult, createTsSourceFile } from '../../shared/code-util';
import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';

export function generateService(
  input: SchemaToBackendAppCodeInput,
  schema: MongoJsonSchemaTypeObject,
  moduleDir: string
): CodeFileResult {
  const collectionStructure = schemaToCollectionStructure(schema);
  const dbPrefix = input.options.dbPrefix;
  const appPrefix = input.options.appPrefix;

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

  const content = createTsSourceFile(
    (sf) => {
      // performance issues when not using a placeholder
      sf.addImportDeclarations([
        {
          namedImports: ['Injectable'],
          moduleSpecifier: PLACEHOLDER_MODULE_NAME_NESTJS_COMMON,
        },
        {
          namedImports: [...getMongoImports(collectionStructure)],
          moduleSpecifier: 'mongodb',
        },
        {
          namedImports: ['Except'],
          moduleSpecifier: PLACEHOLDER_MODULE_NAME_TYPE_FEST,
        },
        {
          namedImports: [
            OBJECT_REMOVE_UNDEFINED_FN_NAME,
            TRANSFORM_IF_EXISTS_FN_NAME,
          ],
          moduleSpecifier: getUtilModuleSpecifier(input),
        },
        {
          namedImports: [
            ...getSharedLibraryInterfaceImports(
              collectionStructure,
              dbPrefix,
              appPrefix
            ),
          ],
          moduleSpecifier: getSharedLibraryModuleSpecifier(input),
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
                type: `Except<${appTypeName}, 'id'>`,
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
                type: `Partial<Except<${appTypeName}, 'id'>>`,
              },
            ],
            returnType: `Promise<${appTypeName}>`,
            statements: [
              [
                `const ${dbVariableName} = await this.${repositoryVariable}.update(`,
                '  new ObjectId(id),',
                `  ${appToDbMapper}WithoutIdPartial(${appVariableName})`,
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
    },
    undefined,
    PLACEHOLDER_MAP
  );

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
    createAppToDbWithoutIdPartialMapperFunctionDeclaration(
      collectionStructure.collectionType,
      dbPrefix,
      appPrefix
    ),
  ];
}
