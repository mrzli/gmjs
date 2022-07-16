import { SchemaToCodeAppsMonorepoOptions } from '../../schema/shared/types';

export interface AddMongoDatabaseToBackendInput {
  readonly appModuleFile: string;
  readonly options: SchemaToCodeAppsMonorepoOptions;
}
