import { SchemaToCodeAppsMonorepoOptions } from '../shared/types';

export interface AddMongoDatabaseToBackendInput {
  readonly appModuleFile: string;
  readonly options: SchemaToCodeAppsMonorepoOptions;
}
