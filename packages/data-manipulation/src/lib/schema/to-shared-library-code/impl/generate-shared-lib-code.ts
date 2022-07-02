import { SchemaToSharedLibraryCodeInput } from '../schema-to-shared-library-code-input';
import path from 'path';
import { pascalCase } from '@gmjs/lib-util';
import { createInterfaceCodeGenerator } from './interface-code-generator';
import {
  CodeFileResult,
  createTsSourceFile,
  getRelativeImportPath,
} from '../../shared/code-util';

export function generateSharedLibCode(
  input: SchemaToSharedLibraryCodeInput
): readonly CodeFileResult[] {
  const indexFile = createIndexFile(input);
  const collectionNameFile = createCollectionNameFile(input);

  const dbInterfaceFiles = createInterfaceCodeGenerator(input, true).generate();
  const appInterfaceFiles = createInterfaceCodeGenerator(
    input,
    false
  ).generate();

  return [
    indexFile,
    collectionNameFile,
    ...dbInterfaceFiles,
    ...appInterfaceFiles,
  ];
}

function createIndexFile(
  input: SchemaToSharedLibraryCodeInput
): CodeFileResult {
  const options = input.options;
  const dbInterfacesIndexPath = path.join(
    options.mongoInterfacesDir,
    options.dbInterfaceOptions.dir,
    'index.ts'
  );
  const appInterfacesIndexPath = path.join(
    options.mongoInterfacesDir,
    options.appInterfaceOptions.dir,
    'index.ts'
  );

  const content = createTsSourceFile((sf) => {
    sf.addExportDeclarations(
      [
        getDbCollectionNameFilePath(input),
        dbInterfacesIndexPath,
        appInterfacesIndexPath,
      ].map((p) => ({
        moduleSpecifier: getRelativeImportPath('index.ts', p),
      }))
    );
  }, input.initialFiles.index);

  return {
    path: 'index.ts',
    content,
  };
}

function createCollectionNameFile(
  input: SchemaToSharedLibraryCodeInput
): CodeFileResult {
  const content = createTsSourceFile((sf) => {
    const collectionNames = input.schemas.map((s) => pascalCase(s.title));

    sf.addEnum({
      name: 'DbCollectionName',
      isExported: true,
      members: collectionNames.map((n) => ({ name: n, value: n })),
    });
  });

  return {
    path: getDbCollectionNameFilePath(input),
    content,
  };
}

function getDbCollectionNameFilePath(
  input: SchemaToSharedLibraryCodeInput
): string {
  return path.join(input.options.mongoInterfacesDir, 'db-collection-name.ts');
}
