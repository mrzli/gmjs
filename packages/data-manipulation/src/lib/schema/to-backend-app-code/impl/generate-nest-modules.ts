import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';
import { MongoJsonSchemaTypeObject } from '../../../shared/mongo/mongo-json-schema';
import { kebabCase } from '@gmjs/lib-util';
import path from 'path';
import { generateRepository } from './generate-repository';
import { generateService } from './generate-service';
import { generateController } from './generate-controller';
import { generateModule } from './generate-module';
import { flatMap } from '@gmjs/util';
import { PathContentPair } from '@gmjs/fs-util';

export function generateNestModules(
  input: SchemaToBackendAppCodeInput
): readonly PathContentPair[] {
  return flatMap(input.schemas, (schema) => generateNestModule(input, schema));
}

function generateNestModule(
  input: SchemaToBackendAppCodeInput,
  schema: MongoJsonSchemaTypeObject
): readonly PathContentPair[] {
  const entityFsName = kebabCase(schema.title);
  const moduleDir = path.join('app', entityFsName);
  return [
    generateRepository(input, schema, moduleDir),
    generateService(input, schema, moduleDir),
    generateController(input, schema, moduleDir),
    generateModule(input, schema, moduleDir),
  ];
}
