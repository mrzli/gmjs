import { SchemaToMongoCodeInput } from '../../input-types';
import { Project } from 'ts-morph';
import { OptionsHelper } from '../util/options-helper';
import { MongoJsonSchemaTypeObject } from '../../../data-model/mongo-json-schema';
import { kebabCase } from '@gmjs/lib-util';
import path from 'path';
import { generateRepository } from './generate-repository';
import { generateService } from './generate-service';
import { generateController } from './generate-controller';
import { generateModule } from './generate-module';

export function generateNestModules(
  input: SchemaToMongoCodeInput,
  project: Project,
  optionsHelper: OptionsHelper
): void {
  const appDir = optionsHelper.resolveAppProjectAppDir();
  for (const schema of input.schemas) {
    generateNestModule(input, project, optionsHelper, schema, appDir);
  }
}

function generateNestModule(
  input: SchemaToMongoCodeInput,
  project: Project,
  optionsHelper: OptionsHelper,
  schema: MongoJsonSchemaTypeObject,
  appDir: string
): void {
  const entityFsName = kebabCase(schema.title);
  const moduleDir = path.join(appDir, entityFsName);
  generateRepository(project, optionsHelper, schema, moduleDir);
  generateService(project, optionsHelper, schema, moduleDir);
  generateController(project, optionsHelper, schema, moduleDir);
  generateModule(project, optionsHelper, schema, moduleDir);
}
