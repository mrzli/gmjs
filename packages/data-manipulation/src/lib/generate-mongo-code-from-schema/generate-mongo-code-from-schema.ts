import { IndentationText, Project, QuoteKind, SourceFile } from 'ts-morph';
import * as prettier from 'prettier';
import { GenerateMongoCodeFromSchemaInput } from './util/types';
import { PathResolver } from './util/path-resolver';
import { addInitialFiles } from './helper-generators/add-initial-files';
import { generateSharedLibCode } from './helper-generators/generate-shared-lib-code';
import { generateAppCode } from './helper-generators/generate-app-code';

export function generateMongoCodeFromSchema(
  input: GenerateMongoCodeFromSchemaInput
): readonly SourceFile[] {
  const pathResolver = new PathResolver(input.options);
  const project = new Project();

  addInitialFiles(input, project, pathResolver);
  generateSharedLibCode(input, project, pathResolver);
  generateAppCode(input, project, pathResolver);

  // format text
  project.getSourceFiles().forEach((sf) => {
    const text = prettier.format(sf.getFullText(), {
      singleQuote: true,
      parser: 'typescript',
    });
    return project.createSourceFile(sf.getFilePath(), text, {
      overwrite: true,
    });
  });

  if (!input.options.isTest) {
    project.saveSync();
  }

  return project.getSourceFiles();
}
