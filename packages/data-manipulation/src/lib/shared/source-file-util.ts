import {
  IndentationText,
  Project,
  ProjectOptions,
  QuoteKind,
  SourceFile,
} from 'ts-morph';
import prettier, { Options } from 'prettier';
import { SetOptional } from 'type-fest';
import { AnyObject } from '@gmjs/util';
import { processTemplateContent } from './file-util';

export interface ProcessTsSourceFileOptions {
  readonly prettify?: boolean;
  readonly substitutions?: AnyObject;
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
  const sf = createTsSourceFileInternal(initialText);
  writer(sf);
  return processTsSourceFile(sf.getFullText(), options);
}

export async function createTsSourceFileAsync(
  writer: (sf: SourceFile) => Promise<void>,
  initialText?: string,
  options?: ProcessTsSourceFileOptions
): Promise<string> {
  const sf = createTsSourceFileInternal(initialText);
  await writer(sf);
  return processTsSourceFile(sf.getFullText(), options);
}

const PRETTIER_OPTIONS: Options = {
  singleQuote: true,
  parser: 'typescript',
};

function createTsSourceFileInternal(initialText?: string): SourceFile {
  const project = new Project(PROJECT_OPTIONS);
  return project.createSourceFile('source-file.ts', initialText);
}

export function processTsSourceFile(
  sourceFileText: string,
  options?: ProcessTsSourceFileOptions
): string {
  const { prettify, substitutions } =
    getFinalProcessTsSourceFileOptions(options);

  const replacedText = processTemplateContent(sourceFileText, substitutions);

  return prettify
    ? prettier.format(replacedText, PRETTIER_OPTIONS)
    : replacedText;
}

function getFinalProcessTsSourceFileOptions(
  options?: ProcessTsSourceFileOptions
): SetOptional<Required<ProcessTsSourceFileOptions>, 'substitutions'> {
  return {
    prettify: options?.prettify ?? true,
    substitutions: options?.substitutions,
  };
}
