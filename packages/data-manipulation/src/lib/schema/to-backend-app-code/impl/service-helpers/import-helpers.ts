import { MongoCollectionStructure } from '../../../../shared/collection-structure/mongo-collection-structure';
import { asChainable, distinctItems, sortArrayByStringAsc } from '@gmjs/util';
import { pascalCase } from '@gmjs/lib-util';
import { mongoBsonTypeToMongoJsType } from '../../../../shared/mongo-schema-util';
import { MongoBsonType } from '@gmjs/mongo-util';
import { SchemaToBackendAppCodeInput } from '../../schema-to-backend-app-code-input';

export function getMongoImports(
  collectionStructure: MongoCollectionStructure
): readonly string[] {
  const fixedMongoImports: readonly string[] = [
    /* 'Collection', 'OptionalId' */
  ];

  const allMongoBsonTypes: MongoBsonType[] = [];
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

export function getSharedLibraryInterfaceImports(
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

export function getSharedLibraryModuleSpecifier(
  input: SchemaToBackendAppCodeInput
): string {
  const appsMonorepo = input.options.appsMonorepo;
  return `@${appsMonorepo.npmScope}/${appsMonorepo.sharedProjectName}`;
}

export function getUtilModuleSpecifier(
  input: SchemaToBackendAppCodeInput
): string {
  const libsMonorepo = input.options.libsMonorepo;
  return `@${libsMonorepo.npmScope}/${libsMonorepo.utilProjectName}`;
}

export function getMongoUtilModuleSpecifier(
  input: SchemaToBackendAppCodeInput
): string {
  const libsMonorepo = input.options.libsMonorepo;
  return `@${libsMonorepo.npmScope}/${libsMonorepo.mongoUtilProjectName}`;
}

export function getNestUtilModuleSpecifier(
  input: SchemaToBackendAppCodeInput
): string {
  const libsMonorepo = input.options.libsMonorepo;
  return `@${libsMonorepo.npmScope}/${libsMonorepo.nestUtilProjectName}`;
}
