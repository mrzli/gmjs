import { GenerateMongoCodeFromSchemaInput } from '../util/types';
import { Project } from 'ts-morph';
import { PathResolver } from '../util/path-resolver';
import { createNestModuleCodeGenerator } from './nest-module-code-generator';

export function generateAppCode(
  input: GenerateMongoCodeFromSchemaInput,
  project: Project,
  pathResolver: PathResolver
): void {
  const appDir = pathResolver.resolveAppProjectAppDir();
  createNestModuleCodeGenerator(input, project, pathResolver).generate();
}
