import {
  SchemaToMongoCodeInput,
  SchemaToMongoCodeTestOverrides,
} from '../schema-to-mongo-code-input';
import { Project } from 'ts-morph';
import { OptionsHelper } from './util/options-helper';
import { readTextSync } from '@gmjs/fs-util';

interface PathAndContent {
  readonly path: string;
  readonly content: string;
}

export function addInitialFiles(
  input: SchemaToMongoCodeInput,
  project: Project,
  optionsHelper: OptionsHelper,
  testOverrides: SchemaToMongoCodeTestOverrides
): void {
  const initialFilePaths: readonly string[] = [
    optionsHelper.resolveSharedProjectIndexFile(),
    optionsHelper.resolveAppProjectAppModuleFile(),
  ];

  const initialFileContents: readonly PathAndContent[] = initialFilePaths.map(
    (p) => ({
      path: p,
      content: readTextSync(testOverrides.getInitialFilePath(p)),
    })
  );

  initialFileContents.forEach((file) => {
    project.createSourceFile(file.path, file.content, { overwrite: true });
  });
}
