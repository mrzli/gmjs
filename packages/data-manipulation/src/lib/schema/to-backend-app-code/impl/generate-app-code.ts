import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';
import { generateNestModules } from './generate-nest-modules';
import { addEntityModulesToAppModule } from './add-entity-modules-to-app-module';
import { CodeFileResult } from '../../shared/code-util';

export function generateAppCode(
  input: SchemaToBackendAppCodeInput
): readonly CodeFileResult[] {
  const nestModuleFiles = generateNestModules(input);
  const appModuleFile = addEntityModulesToAppModule(input);

  return [...nestModuleFiles, appModuleFile];
}
