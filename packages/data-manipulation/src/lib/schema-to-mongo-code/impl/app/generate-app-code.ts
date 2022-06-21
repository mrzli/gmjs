import { SchemaToMongoCodeInput } from '../../input-types';
import { Project } from 'ts-morph';
import { OptionsHelper } from '../util/options-helper';
import { generateNestModules } from './generate-nest-modules';
import { addEntityModulesToAppModule } from './add-entity-modules-to-app-module';

export function generateAppCode(
  input: SchemaToMongoCodeInput,
  project: Project,
  optionsHelper: OptionsHelper
): void {
  generateNestModules(input, project, optionsHelper);
  addEntityModulesToAppModule(input, project, optionsHelper);
}
