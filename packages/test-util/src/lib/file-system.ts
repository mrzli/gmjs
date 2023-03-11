import path from 'path';
import { Fn0, ReadonlyRecord } from '@gmjs/util';
import { expect } from '@jest/globals';
import { findDirsShallowSync, readTextFilesInDirSync } from '@gmjs/fs-util';

export interface TestFileSystemExample<TExampleInput> {
  readonly description: string;
  readonly input: TExampleInput;
  readonly expected: string | undefined;
}

export interface TestFileSystemExampleFileData {
  readonly dir: string;
  readonly files: ReadonlyRecord<string, string>;
}

export type ExampleMappingFn<TExampleInput> = (
  fileData: TestFileSystemExampleFileData
) => TestFileSystemExample<TExampleInput>;

export function getFileSystemTestExamples<TExampleInput>(
  examplesRootDir: string,
  exampleMapping: ExampleMappingFn<TExampleInput>
): readonly TestFileSystemExample<TExampleInput>[] {
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

export function createFileSystemExampleTest<TExampleInput, TActualResult>(
  example: TestFileSystemExample<TExampleInput>,
  testedFunctionCall: () => TActualResult,
  actualResultTransformer: (actual: TActualResult) => string
): Fn0<Promise<void>> {
  return () =>
    doFileSystemExampleTest(
      example,
      testedFunctionCall,
      actualResultTransformer
    );
}

async function doFileSystemExampleTest<TExampleInput, TActualResult>(
  example: TestFileSystemExample<TExampleInput>,
  testedFunctionCall: () => TActualResult,
  actualResultTransformer: (actual: TActualResult) => string
): Promise<void> {
  if (example.expected !== undefined) {
    const actual = actualResultTransformer(testedFunctionCall());
    expect(actual).toEqual(example.expected);
  } else {
    expect(testedFunctionCall).toThrow();
  }
}
