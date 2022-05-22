import { GenerateMongoCodeFromSchemaInput } from '../util/types';
import { Project } from 'ts-morph';
import { PathResolver } from '../util/path-resolver';
import { TEST_FILE_SUFFIX } from '../test/test-util';

export function addInitialFiles(
  input: GenerateMongoCodeFromSchemaInput,
  project: Project,
  pathResolver: PathResolver
): void {
  const initialFiles: readonly string[] = [
    pathResolver.resolveSharedProjectIndexFile(),
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
