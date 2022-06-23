import path from 'path';
import { Fn0, ReadonlyRecord } from '@gmjs/util';
import { expect } from '@jest/globals';
import { findDirsShallowSync, readTextFilesInDirSync } from '@gmjs/fs-util';

export interface TestFileSystemExample<TExampleInput, TExampleExpected> {
  readonly description: string;
  readonly input: TExampleInput;
  readonly expected: TExampleExpected | undefined;
}

export interface TestFileSystemExampleFileData {
  readonly dir: string;
  readonly files: ReadonlyRecord<string, string>;
}

export type ExampleMappingFn<TExampleInput, TExampleExpected> = (
  fileData: TestFileSystemExampleFileData
) => TestFileSystemExample<TExampleInput, TExampleExpected>;

export function getFileSystemTestExamples<TExampleInput, TExampleExpected>(
  examplesRootDir: string,
  exampleMapping: ExampleMappingFn<TExampleInput, TExampleExpected>
): readonly TestFileSystemExample<TExampleInput, TExampleExpected>[] {
  const testExamples = getFileSystemTestExamplesInternal(examplesRootDir);
  return testExamples.map(exampleMapping);
}

function getFileSystemTestExamplesInternal(
  examplesRootDir: string
): readonly TestFileSystemExampleFileData[] {
  const exampleDirs = findDirsShallowSync(examplesRootDir);
  return exampleDirs.map((d) => {
    const result = readTextFilesInDirSync(d.fullPath);
    return {
      dir: path.basename(result.dirFullPath),
      files: result.files,
    };
  });
}

export function createFileSystemExampleTest<
  TExampleInput,
  TExampleExpected,
  TActualResult
>(
  example: TestFileSystemExample<TExampleInput, TExampleExpected>,
  testedFunctionCall: () => TActualResult,
  actualResultTransformer: (actual: TActualResult) => string,
  exampleExpectedTransformer: (expected: TExampleExpected) => string
): Fn0<Promise<void>> {
  return () =>
    doFileSystemExampleTest(
      example,
      testedFunctionCall,
      actualResultTransformer,
      exampleExpectedTransformer
    );
}

async function doFileSystemExampleTest<
  TExampleInput,
  TExampleExpected,
  TActualResult
>(
  example: TestFileSystemExample<TExampleInput, TExampleExpected>,
  testedFunctionCall: () => TActualResult,
  actualResultTransformer: (actual: TActualResult) => string,
  exampleExpectedTransformer: (expected: TExampleExpected) => string
): Promise<void> {
  if (example.expected) {
    const actual = actualResultTransformer(testedFunctionCall());
    expect(actual).toEqual(exampleExpectedTransformer(example.expected));
  } else {
    expect(testedFunctionCall).toThrow();
  }
}
