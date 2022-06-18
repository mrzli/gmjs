import {
  CodeBlockWriter,
  FunctionDeclarationStructure,
  OptionalKind,
  Project,
  Scope,
  WriterFunction,
} from 'ts-morph';
import { OptionsHelper } from '../util/options-helper';
import {
  MongoJsonSchemaBsonType,
  MongoJsonSchemaTypeObject,
} from '../../../data-model/mongo-json-schema';
import { camelCase, kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import {
  PLACEHOLDER_MODULE_NAME_NESTJS_COMMON,
  PLACEHOLDER_MODULE_NAME_TYPE_FEST,
} from '../util/placeholders';
import { schemaToCollectionStructure } from '../util/collection-structure/mongo-collection-structure-util';
import {
  MongoCollectionStructure,
  MongoEntityStructure,
} from '../util/collection-structure/mongo-collection-structure';
import {
  asChainable,
  compareFnStringAsc,
  distinctItems,
  sortArray,
  sortArrayByStringAsc,
} from '@gmjs/util';
import {
  getAppInterfacePropertyName,
  mongoBsonTypeToMongoJsType,
} from '../util/util';

export function generateService(
  project: Project,
  optionsHelper: OptionsHelper,
  schema: MongoJsonSchemaTypeObject,
  moduleDir: string
): void {
  const collectionStructure = schemaToCollectionStructure(schema);
  const dbPrefix = optionsHelper.getDbInterfacePrefix();
  const appPrefix = optionsHelper.getAppInterfacePrefix();

  const collectionEntityName = collectionStructure.collectionType.name;

  const entityFsName = kebabCase(collectionEntityName);
  const typeName = pascalCase(collectionEntityName);
  const variableName = camelCase(collectionEntityName);

  const dbVariableName = camelCase(`${dbPrefix}${typeName}`);
  const appTypeName = pascalCase(`${appPrefix}${typeName}`);
  const appVariableName = camelCase(`${appPrefix}${typeName}`);

  const filePath = path.join(moduleDir, `${entityFsName}.service.ts`);
  const sf = project.createSourceFile(filePath);

  const repositoryVariable = `${variableName}Repository`;
  const repositoryType = `${typeName}Repository`;

  const dbToAppMapper = getDbToAppMapperFunctionName(typeName);
  const appToDbMapper = getAppToDbMapperFunctionName(typeName);

  const transformIfExists = 'transformIfExists';

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
      namedImports: ['objectRemoveUndefined', transformIfExists],
      moduleSpecifier: optionsHelper.getUtilModuleSpecifier(),
    },
    {
      namedImports: [
        ...getSharedLibraryInterfaceImports(
          collectionStructure,
          dbPrefix,
          appPrefix
        ),
      ],
      moduleSpecifier: optionsHelper.getSharedLibraryModuleSpecifier(),
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
          `return ${transformIfExists}(${dbVariableName}, ${dbToAppMapper}, undefined);`,
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
}

function getMongoImports(
  collectionStructure: MongoCollectionStructure
): readonly string[] {
  const fixedMongoImports: readonly string[] = [
    /* 'Collection', 'OptionalId' */
  ];

  const allMongoBsonTypes: MongoJsonSchemaBsonType[] = [];
  allMongoBsonTypes.push(...collectionStructure.collectionType.mongoTypes);
  for (const embeddedType of collectionStructure.embeddedTypes) {
    allMongoBsonTypes.push(...embeddedType.mongoTypes);
  }

  return asChainable(allMongoBsonTypes)
    .apply(distinctItems)
    .map(mongoBsonTypeToMongoJsType)
    .apply((items) => [...items, ...fixedMongoImports])
    .apply(sortArrayByStringAsc)
    .getValue();
}

function getSharedLibraryInterfaceImports(
  collectionStructure: MongoCollectionStructure,
  dbPrefix: string,
  appPrefix: string
): readonly string[] {
  const entityNames: readonly string[] = [
    collectionStructure.collectionType.name,
    ...collectionStructure.embeddedTypes.map((item) => item.name),
  ].map(pascalCase);

  const dbEntityNames = entityNames.map((name) =>
    pascalCase(`${dbPrefix}${name}`)
  );

  const appEntityNames = entityNames.map((name) =>
    pascalCase(`${appPrefix}${name}`)
  );

  return asChainable(dbEntityNames.concat(appEntityNames))
    .apply(distinctItems)
    .apply(sortArrayByStringAsc)
    .getValue();
}

function createMapperFunctionDeclarations(
  collectionStructure: MongoCollectionStructure,
  dbPrefix: string,
  appPrefix: string
): readonly OptionalKind<FunctionDeclarationStructure>[] {
  const entities: readonly MongoEntityStructure[] = [
    collectionStructure.collectionType,
    ...sortArray(collectionStructure.embeddedTypes, (item1, item2) =>
      compareFnStringAsc(item1.name, item2.name)
    ),
  ];

  return [
    ...entities.map((entity) =>
      createDbToAppMapperFunctionDeclaration(entity, dbPrefix, appPrefix)
    ),
    ...entities.map((entity) =>
      createAppToDbMapperFunctionDeclaration(entity, dbPrefix, appPrefix)
    ),
    createAppToDbWithoutIdPartialMapperFunctionDeclaration(
      collectionStructure.collectionType,
      dbPrefix,
      appPrefix
    ),
  ];
}

function createDbToAppMapperFunctionDeclaration(
  entity: MongoEntityStructure,
  dbPrefix: string,
  appPrefix: string
): OptionalKind<FunctionDeclarationStructure> {
  const typeName = pascalCase(entity.name);
  const dbTypeName = pascalCase(`${dbPrefix}${typeName}`);
  const dbVariableName = camelCase(`${dbPrefix}${typeName}`);
  const appTypeName = pascalCase(`${appPrefix}${typeName}`);
  const appVariableName = camelCase(`${appPrefix}${typeName}`);

  const statement: WriterFunction = (writer: CodeBlockWriter) => {
    writer.write('return').block(() => {
      for (const property of entity.properties) {
        writer.writeLine(
          `${getAppInterfacePropertyName(property.name)}: ${dbVariableName}.${
            property.name
          },`
        );
      }
    });
  };

  return {
    name: getDbToAppMapperFunctionName(entity.name),
    isExported: true,
    isAsync: false,
    parameters: [
      {
        name: dbVariableName,
        type: dbTypeName,
      },
    ],
    returnType: appTypeName,
    statements: [statement],
  };
}

function createAppToDbMapperFunctionDeclaration(
  entity: MongoEntityStructure,
  dbPrefix: string,
  appPrefix: string
): OptionalKind<FunctionDeclarationStructure> {
  const typeName = pascalCase(entity.name);
  const dbTypeName = pascalCase(`${dbPrefix}${typeName}`);
  const dbVariableName = camelCase(`${dbPrefix}${typeName}`);
  const appTypeName = pascalCase(`${appPrefix}${typeName}`);
  const appVariableName = camelCase(`${appPrefix}${typeName}`);

  const statement: WriterFunction = (writer: CodeBlockWriter) => {
    writer.write('return').block(() => {
      for (const property of entity.properties) {
        writer.writeLine(
          `${property.name}: ${appVariableName}.${getAppInterfacePropertyName(
            property.name
          )},`
        );
      }
    });
  };

  return {
    name: getAppToDbMapperFunctionName(entity.name),
    isExported: true,
    isAsync: false,
    parameters: [
      {
        name: appVariableName,
        type: appTypeName,
      },
    ],
    returnType: dbTypeName,
    statements: [statement],
  };
}

function createAppToDbWithoutIdPartialMapperFunctionDeclaration(
  entity: MongoEntityStructure,
  dbPrefix: string,
  appPrefix: string
): OptionalKind<FunctionDeclarationStructure> {
  const typeName = pascalCase(entity.name);
  const dbTypeName = pascalCase(`${dbPrefix}${typeName}`);
  const dbVariableName = camelCase(`${dbPrefix}${typeName}`);
  const appTypeName = pascalCase(`${appPrefix}${typeName}`);
  const appVariableName = camelCase(`${appPrefix}${typeName}`);

  const statement: WriterFunction = (writer: CodeBlockWriter) => {
    writer.write('return').block(() => {
      for (const property of entity.properties) {
        writer.writeLine(
          `${property.name}: ${appVariableName}.${getAppInterfacePropertyName(
            property.name
          )},`
        );
      }
    });
  };

  return {
    name: `${getAppToDbMapperFunctionName(entity.name)}WithoutIdPartial`,
    isExported: true,
    isAsync: false,
    parameters: [
      {
        name: appVariableName,
        type: `Partial<Except<${appTypeName}>, 'id'>`,
      },
    ],
    returnType: `Partial<Except<${dbTypeName}>, '_id'>`,
    statements: [statement],
  };
}

function getDbToAppMapperFunctionName(entityName: string): string {
  const typeName = pascalCase(entityName);
  return `db${typeName}ToApp${typeName}`;
}

function getAppToDbMapperFunctionName(entityName: string): string {
  const typeName = pascalCase(entityName);
  return `app${typeName}ToDb${typeName}`;
}
