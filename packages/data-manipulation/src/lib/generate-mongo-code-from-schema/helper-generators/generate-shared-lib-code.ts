import { GenerateMongoCodeFromSchemaInput } from '../util/types';
import { Project } from 'ts-morph';
import { PathResolver } from '../util/path-resolver';
import * as path from 'path';
import { getRelativeImportPath } from '../util/util';
import { pascalCase } from '@gmjs/lib-util';
import { createInterfaceCodeGenerator } from './generate-interfaces-code';

export function generateSharedLibCode(
  input: GenerateMongoCodeFromSchemaInput,
  project: Project,
  pathResolver: PathResolver
): void {
  const libIndexPath = pathResolver.resolveSharedProjectIndexFile();
  const libInterfacesDir = pathResolver.resolveSharedProjectInterfacesRootDir();
  const dbCollectionNamePath = path.join(
    libInterfacesDir,
    'db-collection-name.ts'
  );
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
    [dbCollectionNamePath, dbInterfacesIndexPath, appInterfacesIndexPath].map(
      (p) => ({
        moduleSpecifier: getRelativeImportPath(libIndexPath, p),
      })
    )
  );

  const collectionNames = input.schemas.map((s) => pascalCase(s.title));

  const dbCollectionNameSf = project.createSourceFile(dbCollectionNamePath);
  dbCollectionNameSf.addEnum({
    name: 'DbCollectionName',
    isExported: true,
    members: collectionNames.map((n) => ({ name: n, value: n })),
  });

  createInterfaceCodeGenerator(
    input,
    project,
    pathResolver,
    true
  ).generateInterfacesCode();
  createInterfaceCodeGenerator(
    input,
    project,
    pathResolver,
    false
  ).generateInterfacesCode();
}
