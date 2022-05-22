import { GenerateMongoCodeFromSchemaInput } from '../util/types';
import { Project } from 'ts-morph';
import { PathResolver } from '../util/path-resolver';
import * as path from 'path';
import { getRelativeImportPath } from '../util/util';
import { pascalCase } from '@gmjs/lib-util';
import { createInterfaceCodeGenerator } from './interface-code-generator';

export function generateSharedLibCode(
  input: GenerateMongoCodeFromSchemaInput,
  project: Project,
  pathResolver: PathResolver
): void {
  addSharedProjectExportDeclarations(input, project, pathResolver);

  const collectionNames = input.schemas.map((s) => pascalCase(s.title));

  const dbCollectionNameSf = project.createSourceFile(
    getDbCollectionNameFilePath(pathResolver)
  );
  dbCollectionNameSf.addEnum({
    name: 'DbCollectionName',
    isExported: true,
    members: collectionNames.map((n) => ({ name: n, value: n })),
  });

  createInterfaceCodeGenerator(input, project, pathResolver, true).generate();
  createInterfaceCodeGenerator(input, project, pathResolver, false).generate();
}

function addSharedProjectExportDeclarations(
  input: GenerateMongoCodeFromSchemaInput,
  project: Project,
  pathResolver: PathResolver
): void {
  const libIndexPath = pathResolver.resolveSharedProjectIndexFile();
  const libInterfacesDir = pathResolver.resolveSharedProjectInterfacesRootDir();
  const dbInterfacesIndexPath = path.join(
    libInterfacesDir,
    input.options.appsMonorepo.dbInterfaceOptions.dir,
    'index.ts'
  );
  const appInterfacesIndexPath = path.join(
    libInterfacesDir,
    input.options.appsMonorepo.appInterfaceOptions.dir,
    'index.ts'
  );

  const libIndexSf = project.addSourceFileAtPath(libIndexPath);
  libIndexSf.addExportDeclarations(
    [
      getDbCollectionNameFilePath(pathResolver),
      dbInterfacesIndexPath,
      appInterfacesIndexPath,
    ].map((p) => ({
      moduleSpecifier: getRelativeImportPath(libIndexPath, p),
    }))
  );
}

function getDbCollectionNameFilePath(pathResolver: PathResolver): string {
  const libInterfacesDir = pathResolver.resolveSharedProjectInterfacesRootDir();
  return path.join(libInterfacesDir, 'db-collection-name.ts');
}
