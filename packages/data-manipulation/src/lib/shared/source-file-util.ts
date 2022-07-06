import {
  IndentationText,
  Project,
  ProjectOptions,
  QuoteKind,
  SourceFile,
} from 'ts-morph';
import prettier, { Options } from 'prettier';
import { SetOptional } from 'type-fest';
import { ImmutableMap } from '@gmjs/util';

export interface ProcessTsSourceFileOptions {
  readonly prettify?: boolean;
  readonly placeholderMap?: ImmutableMap<string, string>;
}

const PROJECT_OPTIONS: ProjectOptions = {
  manipulationSettings: {
    indentationText: IndentationText.TwoSpaces,
    quoteKind: QuoteKind.Single,
    useTrailingCommas: true,
  },
};

export function createTsSourceFile(
  writer: (sf: SourceFile) => void,
  initialText?: string,
  options?: ProcessTsSourceFileOptions
): string {
  const project = new Project(PROJECT_OPTIONS);
  const sf = project.createSourceFile('source-file.ts', initialText);
  writer(sf);
  return processTsSourceFile(sf.getFullText(), options);
}

const PRETTIER_OPTIONS: Options = {
  singleQuote: true,
  parser: 'typescript',
};

export function processTsSourceFile(
  sourceFileText: string,
  options?: ProcessTsSourceFileOptions
): string {
  const { prettify, placeholderMap } =
    getFinalProcessTsSourceFileOptions(options);

  let replacedText = sourceFileText;
  if (placeholderMap !== undefined) {
    for (const { key, value } of placeholderMap.entryPairs()) {
      replacedText = replacedText.replace(key, value);
    }
  }

  return prettify
    ? prettier.format(replacedText, PRETTIER_OPTIONS)
    : replacedText;
}

function getFinalProcessTsSourceFileOptions(
  options?: ProcessTsSourceFileOptions
): SetOptional<Required<ProcessTsSourceFileOptions>, 'placeholderMap'> {
  return {
    prettify: options?.prettify ?? true,
    placeholderMap: options?.placeholderMap,
  };
}