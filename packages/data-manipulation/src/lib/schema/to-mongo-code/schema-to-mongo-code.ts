import { Project, SourceFile } from 'ts-morph';
import {
  SchemaToMongoCodeInput,
  SchemaToMongoCodeTestOverrides,
} from './schema-to-mongo-code-input';
import { OptionsHelper } from './impl/util/options-helper';
import { addInitialFiles } from './impl/add-initial-files';
import { generateSharedLibCode } from './impl/lib/generate-shared-lib-code';
import { generateAppCode } from './impl/app/generate-app-code';
import { PLACEHOLDER_MAP } from './impl/util/placeholders';
import { identifyFn } from '@gmjs/util';
import { processTsSourceFile } from '../shared/code-util';

export function schemaToMongoCode(
  input: SchemaToMongoCodeInput,
  testOverrides?: SchemaToMongoCodeTestOverrides
): readonly SourceFile[] {
  const optionsHelper = new OptionsHelper(input.options);
  const project = new Project();

  testOverrides ??= {
    getInitialFilePath: identifyFn,
    saveTsMorphProject: (project) => {
      project.saveSync();
    },
  };

  addInitialFiles(input, project, optionsHelper, testOverrides);
  generateSharedLibCode(input, project, optionsHelper);
  generateAppCode(input, project, optionsHelper);

  // process and format source code
  project.getSourceFiles().forEach((sf) => {
    return project.createSourceFile(
      sf.getFilePath(),
      processTsSourceFile(sf.getFullText(), PLACEHOLDER_MAP),
      {
        overwrite: true,
      }
    );
  });

  testOverrides.saveTsMorphProject(project);

  return project.getSourceFiles();
}
