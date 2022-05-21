import { IndentationText, Project, QuoteKind, SourceFile } from 'ts-morph';
import * as prettier from 'prettier';
import { pascalCase } from '@gmjs/lib-util';
import { GenerateMongoCodeFromSchemaInput } from './util/types';
import { TEST_FILE_SUFFIX } from './test/test-util';
import { PathResolver } from './util/path-resolver';
import { getRelativeImportPath } from './util/util';
import { createInterfaceCodeGenerator } from './helper-generators/generate-interfaces-code';

export function generateMongoCodeFromSchema(
  input: GenerateMongoCodeFromSchemaInput
): readonly SourceFile[] {
  const pathResolver = new PathResolver(input.options);
  const project = new Project({
    manipulationSettings: {
      quoteKind: QuoteKind.Single,
      indentationText: IndentationText.TwoSpaces,
    },
  });

  addInitialFiles(input, project, pathResolver);
  generateSharedLibCode(input, project, pathResolver);

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

function addInitialFiles(
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

function generateSharedLibCode(
  input: GenerateMongoCodeFromSchemaInput,
  project: Project,
  pathResolver: PathResolver
): void {
  const libIndexPath = pathResolver.resolveSharedProjectIndexFile();
  const dbCollectionNamePath =
    pathResolver.resolveSharedProjectDbCollectionNameFile();

  const libIndexSf = project.addSourceFileAtPath(libIndexPath);
  libIndexSf.addExportDeclaration({
    moduleSpecifier: getRelativeImportPath(libIndexPath, dbCollectionNamePath),
  });

  const collectionNames = input.schemas.map((s) => pascalCase(s.title));

  const dbCollectionNameSf = project.createSourceFile(dbCollectionNamePath);
  dbCollectionNameSf.addEnum({
    name: 'DbCollectionName',
    isExported: true,
    members: collectionNames.map((n) => ({ name: n, value: n })),
  });

  createInterfaceCodeGenerator(
    input,
    project,
    pathResolver,
    true
  ).generateInterfacesCode();
  createInterfaceCodeGenerator(
    input,
    project,
    pathResolver,
    false
  ).generateInterfacesCode();
}
