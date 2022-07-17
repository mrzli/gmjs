import { SchemaToCodeAppsMonorepoOptions } from '../../shared/types';

export interface BackendMongoDatabaseInput {
  readonly appModuleFile: string;
  readonly options: SchemaToCodeAppsMonorepoOptions;
}
