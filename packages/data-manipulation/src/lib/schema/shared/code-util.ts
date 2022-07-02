import prettier from 'prettier';
import { ImmutableMap } from '@gmjs/util';
import { IndentationText, Project, SourceFile } from 'ts-morph';

export function createTsSourceFile(
  writer: (sf: SourceFile) => void,
  initialText?: string,
  placeholderMap?: ImmutableMap<string, string>
): string {
  const project = new Project({
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
    },
  });
  const sf = project.createSourceFile('source-file.ts', initialText);
  writer(sf);
  return processTsSourceFile(sf.getFullText(), placeholderMap);
}

export function processTsSourceFile(
  sourceFileText: string,
  placeholderMap?: ImmutableMap<string, string>
): string {
  let replacedText = sourceFileText;
  if (placeholderMap !== undefined) {
    for (const { key, value } of placeholderMap.entryPairs()) {
      replacedText = replacedText.replace(key, value);
    }
  }

  return prettier.format(replacedText, {
    singleQuote: true,
    parser: 'typescript',
  });
}

export interface CodeFileResult {
  readonly path: string;
  readonly content: string;
}
