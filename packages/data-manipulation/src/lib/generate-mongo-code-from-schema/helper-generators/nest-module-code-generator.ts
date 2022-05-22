import { GenerateMongoCodeFromSchemaInput } from '../util/types';
import { Project } from 'ts-morph';
import { PathResolver } from '../util/path-resolver';
import { MongoJsonSchemaTypeObject } from '../../data-model/mongo-json-schema';
import { kebabCase } from '@gmjs/lib-util';
import * as path from 'path';

export interface NestModuleCodeGenerator {
  generate(): void;
}

export function createNestModuleCodeGenerator(
  input: GenerateMongoCodeFromSchemaInput,
  project: Project,
  pathResolver: PathResolver
): NestModuleCodeGenerator {
  return new NestModuleCodeGeneratorImpl(input, project, pathResolver);
}

class NestModuleCodeGeneratorImpl implements NestModuleCodeGenerator {
  public constructor(
    private readonly input: GenerateMongoCodeFromSchemaInput,
    private readonly project: Project,
    private readonly pathResolver: PathResolver
  ) {}

  public generate(): void {
    const appDir = this.pathResolver.resolveAppProjectAppDir();
    for (const schema of this.input.schemas) {
      this.generateNestModule(schema, appDir);
    }
  }

  private generateNestModule(
    schema: MongoJsonSchemaTypeObject,
    appDir: string
  ): void {
    const entityFsName = kebabCase(schema.title);
    const moduleDir = path.join(appDir, entityFsName);
  }

  private generateRepository(
    schema: MongoJsonSchemaTypeObject,
    moduleDir: string,
    entityFsName: string
  ): void {
    const filePath = path.join(moduleDir, `${entityFsName}.repository.ts`);
    const sf = this.project.createSourceFile(filePath);
  }
}
