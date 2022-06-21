import { MongoJsonSchemaTypeObject } from '../data-model/mongo-json-schema';

export interface SchemaToMongoCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly options: SchemaToMongoCodeOptions;
}

export interface SchemaToMongoCodeOptions {
  readonly rootDir: string;
  readonly isTest: boolean;
  readonly libsMonorepoNames: SchemaToMongoCodeLibsMonorepoNamesOptions;
  readonly appsMonorepo: SchemaToMongoCodeAppsMonorepoOptions;
}

export interface SchemaToMongoCodeLibsMonorepoNamesOptions {
  readonly npmScope: string;
  readonly utilProjectName: string;
  readonly nestUtilProjectName: string;
}

export interface SchemaToMongoCodeAppsMonorepoOptions {
  readonly npmScope: string;
  readonly libsDir: string;
  readonly appsDir: string;
  readonly dbInterfaceOptions: SchemaToMongoCodeInterfaceOptions;
  readonly appInterfaceOptions: SchemaToMongoCodeInterfaceOptions;
  readonly sharedProject: SchemaToMongoCodeSharedProjectOptions;
  readonly appProject: SchemaToMongoCodeAppProjectOptions;
}

export interface SchemaToMongoCodeInterfaceOptions {
  readonly dir: string;
  readonly prefix: string;
}

export interface SchemaToMongoCodeSharedProjectOptions {
  readonly projectName: string;
  readonly sharedInterfacesDir: string;
  readonly indexFilePath: string;
}

export interface SchemaToMongoCodeAppProjectOptions {
  readonly projectName: string;
  readonly appDir: string;
}
