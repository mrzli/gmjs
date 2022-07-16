import { SchemaToSharedLibraryCodeInput } from '../schema-to-shared-library-code-input';
import path from 'path';
import { pascalCase } from '@gmjs/lib-util';
import { createInterfaceCodeGenerator } from './interface-code-generator';
import { getRelativeImportPath } from '../../../shared/code-util';
import { PathContentPair } from '@gmjs/fs-util';
import { createTsSourceFile } from '../../../shared/source-file-util';
import {
  APP_INTERFACES_DIR,
  DB_INTERFACES_DIR,
  MONGO_INTERFACES_DIR,
} from './constants';

const DB_COLLECTION_NAME_FILE_PATH = path.join(
  MONGO_INTERFACES_DIR,
  'db-collection-name.ts'
);

export function generateSharedLibCode(
  input: SchemaToSharedLibraryCodeInput
): readonly PathContentPair[] {
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
): PathContentPair {
  const dbInterfacesIndexPath = path.join(
    MONGO_INTERFACES_DIR,
    DB_INTERFACES_DIR,
    'index.ts'
  );
  const appInterfacesIndexPath = path.join(
    MONGO_INTERFACES_DIR,
    APP_INTERFACES_DIR,
    'index.ts'
  );

  const content = createTsSourceFile((sf) => {
    sf.addExportDeclarations(
      [
        DB_COLLECTION_NAME_FILE_PATH,
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
): PathContentPair {
  const content = createTsSourceFile((sf) => {
    const collectionNames = input.schemas.map((s) => pascalCase(s.title));

    sf.addEnum({
      name: 'DbCollectionName',
      isExported: true,
      members: collectionNames.map((n) => ({ name: n, value: n })),
    });
  });

  return {
    path: DB_COLLECTION_NAME_FILE_PATH,
    content,
  };
}
