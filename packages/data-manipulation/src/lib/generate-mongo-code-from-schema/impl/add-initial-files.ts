import { GenerateMongoCodeFromSchemaInput } from '../input-types';
import { Project } from 'ts-morph';
import { OptionsHelper } from './util/options-helper';
import { TEST_FILE_SUFFIX } from '../test/test-util';

export function addInitialFiles(
  input: GenerateMongoCodeFromSchemaInput,
  project: Project,
  optionsHelper: OptionsHelper
): void {
  const initialFiles: readonly string[] = [
    optionsHelper.resolveSharedProjectIndexFile(),
  ];

  for (const initialFile of initialFiles) {
    if (input.options.isTest) {
      const sf = project.addSourceFileAtPath(initialFile + TEST_FILE_SUFFIX);
      sf.move(initialFile);
    } else {
      project.addSourceFileAtPath(initialFile);
    }
  }
}
