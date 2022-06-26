import { MongoJsonSchemaTypeObject } from '../../shared/mongo-json-schema';

export interface SchemaToSeedDbCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly libsMonorepo: SchemaToSeedDbCodeLibsMonorepoOptions;
  readonly appsMonorepo: SchemaToSeedDbCodeAppsMonorepoOptions;
}

export interface SchemaToSeedDbCodeLibsMonorepoOptions {
  readonly npmScope: string;
  readonly mongoUtilProjectName: string;
}

export interface SchemaToSeedDbCodeAppsMonorepoOptions {
  readonly npmScope: string;
  readonly sharedLibProjectName: string;
}