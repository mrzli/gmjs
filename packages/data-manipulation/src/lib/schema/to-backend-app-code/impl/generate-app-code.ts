import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';
import { generateNestModules } from './generate-nest-modules';
import { addEntityModulesToAppModule } from './add-entity-modules-to-app-module';
import { PathContentPair } from '@gmjs/fs-util';

export function generateAppCode(
  input: SchemaToBackendAppCodeInput
): readonly PathContentPair[] {
  const nestModuleFiles = generateNestModules(input);
  const appModuleFile = addEntityModulesToAppModule(input);

  return [...nestModuleFiles, appModuleFile];
}
