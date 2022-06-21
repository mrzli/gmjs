import { SchemaToMongoCodeInput } from '../input-types';
import { Project } from 'ts-morph';
import { OptionsHelper } from './util/options-helper';
import { TEST_FILE_SUFFIX } from '../test/test-util';
import { readTextSync } from '@gmjs/fs-util';

interface PathAndContent {
  readonly path: string;
  readonly content: string;
}

export function addInitialFiles(
  input: SchemaToMongoCodeInput,
  project: Project,
  optionsHelper: OptionsHelper
): void {
  const initialFilePaths: readonly string[] = [
    optionsHelper.resolveSharedProjectIndexFile(),
    optionsHelper.resolveAppProjectAppModuleFile(),
  ];

  const initialFileContents: readonly PathAndContent[] = initialFilePaths.map(
    (p) => ({
      path: p,
      content: readTextSync(p + (input.options.isTest ? TEST_FILE_SUFFIX : '')),
    })
  );

  initialFileContents.forEach((file) => {
    project.createSourceFile(file.path, file.content, { overwrite: true });
  });
}
