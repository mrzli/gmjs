import { MongoJsonSchemaTypeObject } from '../data-model/mongo-json-schema';

export interface GenerateMongoCodeFromSchemaInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly options: GenerateMongoCodeFromSchemaOptions;
}

export interface GenerateMongoCodeFromSchemaOptions {
  readonly rootDir: string;
  readonly isTest: boolean;
  readonly libsMonorepoNames: GenerateMongoCodeFromSchemaLibsMonorepoNamesOptions;
  readonly appsMonorepo: GenerateMongoCodeFromSchemaAppsMonorepoOptions;
}

export interface GenerateMongoCodeFromSchemaLibsMonorepoNamesOptions {
  readonly npmScope: string;
  readonly utilProjectName: string;
  readonly nestUtilProjectName: string;
}

export interface GenerateMongoCodeFromSchemaAppsMonorepoOptions {
  readonly npmScope: string;
  readonly libsDir: string;
  readonly appsDir: string;
  readonly dbInterfaceOptions: GenerateMongoCodeFromSchemaInterfaceOptions;
  readonly appInterfaceOptions: GenerateMongoCodeFromSchemaInterfaceOptions;
  readonly sharedProject: GenerateMongoCodeFromSchemaSharedProjectOptions;
  readonly appProject: GenerateMongoCodeFromSchemaAppProjectOptions;
}

export interface GenerateMongoCodeFromSchemaInterfaceOptions {
  readonly dir: string;
  readonly prefix: string;
}

export interface GenerateMongoCodeFromSchemaSharedProjectOptions {
  readonly projectName: string;
  readonly sharedInterfacesDir: string;
  readonly indexFilePath: string;
}

export interface GenerateMongoCodeFromSchemaAppProjectOptions {
  readonly projectName: string;
  readonly appDir: string;
}
