import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';

export interface SchemaToCliAppCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly initialFiles: SchemaToCliAppCodeInitialFiles;
  readonly options: SchemaToCliAppCodeOptions;
}

export interface SchemaToCliAppCodeInitialFiles {
  readonly appModule: string;
}

export interface SchemaToCliAppCodeOptions {
  readonly libsMonorepo: SchemaToCliAppCodeLibsMonorepoOptions;
  readonly appsMonorepo: SchemaToCliAppCodeAppsMonorepoOptions;
  readonly dbPrefix: string;
  readonly appPrefix: string;
}

export interface SchemaToCliAppCodeLibsMonorepoOptions {
  readonly npmScope: string;
  readonly utilProjectName: string;
  readonly nestUtilProjectName: string;
}

export interface SchemaToCliAppCodeAppsMonorepoOptions {
  readonly npmScope: string;
  readonly sharedProjectName: string;
}
