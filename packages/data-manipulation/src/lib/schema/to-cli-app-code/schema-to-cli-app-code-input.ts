import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';

export interface SchemaToCliAppCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly options: SchemaToCliAppCodeOptions;
}

export interface SchemaToCliAppCodeOptions {
  readonly libsMonorepo: SchemaToCliAppCodeLibsMonorepoOptions;
  readonly appsMonorepo: SchemaToCliAppCodeAppsMonorepoOptions;
}

export interface SchemaToCliAppCodeLibsMonorepoOptions {
  readonly npmScope: string;
  readonly utilProjectName: string;
  readonly libUtilProjectName: string;
  readonly mongoUtilProjectName: string;
}

export interface SchemaToCliAppCodeAppsMonorepoOptions {
  readonly npmScope: string;
  readonly libsDir: string;
  readonly projectName: string;
  readonly sharedLibProjectName: string;
}
