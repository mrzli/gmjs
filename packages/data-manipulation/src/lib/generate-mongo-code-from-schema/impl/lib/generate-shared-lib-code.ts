import { GenerateMongoCodeFromSchemaInput } from '../../input-types';
import { Project } from 'ts-morph';
import { OptionsHelper } from '../util/options-helper';
import path from 'path';
import { getRelativeImportPath } from '../util/util';
import { pascalCase } from '@gmjs/lib-util';
import { createInterfaceCodeGenerator } from './interface-code-generator';

export function generateSharedLibCode(
  input: GenerateMongoCodeFromSchemaInput,
  project: Project,
  optionsHelper: OptionsHelper
): void {
  addSharedProjectExportDeclarations(input, project, optionsHelper);

  const collectionNames = input.schemas.map((s) => pascalCase(s.title));

  const dbCollectionNameSf = project.createSourceFile(
    getDbCollectionNameFilePath(optionsHelper)
  );
  dbCollectionNameSf.addEnum({
    name: 'DbCollectionName',
    isExported: true,
    members: collectionNames.map((n) => ({ name: n, value: n })),
  });

  createInterfaceCodeGenerator(input, project, optionsHelper, true).generate();
  createInterfaceCodeGenerator(input, project, optionsHelper, false).generate();
}

function addSharedProjectExportDeclarations(
  input: GenerateMongoCodeFromSchemaInput,
  project: Project,
  optionsHelper: OptionsHelper
): void {
  const libIndexPath = optionsHelper.resolveSharedProjectIndexFile();
  const libInterfacesDir =
    optionsHelper.resolveSharedProjectInterfacesRootDir();
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
      getDbCollectionNameFilePath(optionsHelper),
      dbInterfacesIndexPath,
      appInterfacesIndexPath,
    ].map((p) => ({
      moduleSpecifier: getRelativeImportPath(libIndexPath, p),
    }))
  );
}

function getDbCollectionNameFilePath(optionsHelper: OptionsHelper): string {
  const libInterfacesDir =
    optionsHelper.resolveSharedProjectInterfacesRootDir();
  return path.join(libInterfacesDir, 'db-collection-name.ts');
}
