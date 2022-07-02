export interface AddMongoDatabaseToBackendInput {
  readonly appModuleFile: string;
  readonly options: AddMongoDatabaseToBackendOptions;
}

export interface AddMongoDatabaseToBackendOptions {
  readonly projectName: string;
  readonly libsMonorepoNpmScope: string;
  readonly nestUtilProjectName: string;
}
