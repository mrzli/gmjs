import { Project, SourceFile } from 'ts-morph';
import prettier from 'prettier';
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
    // there is some performance issue with source code generation when it contains a 'type-fest' import
    // therefore I import with a placeholder which I then replace here
    let processedText = sf.getFullText();
    for (const { key, value } of PLACEHOLDER_MAP.entryPairs()) {
      processedText = processedText.replace(key, value);
    }

    const text = prettier.format(processedText, {
      singleQuote: true,
      parser: 'typescript',
    });
    return project.createSourceFile(sf.getFilePath(), text, {
      overwrite: true,
    });
  });

  testOverrides.saveTsMorphProject(project);

  return project.getSourceFiles();
}