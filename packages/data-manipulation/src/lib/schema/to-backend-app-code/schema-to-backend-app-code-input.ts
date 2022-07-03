import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';

export interface SchemaToBackendAppCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly initialFiles: SchemaToBackendAppCodeInitialFiles;
  readonly options: SchemaToBackendAppCodeOptions;
}

export interface SchemaToBackendAppCodeInitialFiles {
  readonly appModule: string;
}

export interface SchemaToBackendAppCodeOptions {
  readonly libsMonorepo: SchemaToBackendAppCodeLibsMonorepoOptions;
  readonly appsMonorepo: SchemaToBackendAppCodeAppsMonorepoOptions;
  readonly dbPrefix: string;
  readonly appPrefix: string;
}

export interface SchemaToBackendAppCodeLibsMonorepoOptions {
  readonly npmScope: string;
  readonly utilProjectName: string;
  readonly nestUtilProjectName: string;
}

export interface SchemaToBackendAppCodeAppsMonorepoOptions {
  readonly npmScope: string;
  readonly sharedProjectName: string;
}
