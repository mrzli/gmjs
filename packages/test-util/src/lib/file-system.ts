import * as path from 'path';
import * as fs from 'fs-extra';
import { Fn0, ReadonlyRecord } from '@gmjs/util';
import * as klawSync from 'klaw-sync';
import { toTestJsonFileContent } from './json';
import { expect } from '@jest/globals';

const ENCODING = 'utf-8';

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
  const exampleDirs = klawSync(examplesRootDir, {
    nofile: true,
    depthLimit: 0,
  });

  return exampleDirs.map((d) => {
    const dir = path.basename(d.path);
    const files = readFilesFromExamplesDir(d.path);
    return {
      dir,
      files,
    };
  });
}

function readFilesFromExamplesDir(
  exampleDir: string
): ReadonlyRecord<string, string> {
  const files = klawSync(exampleDir, { nodir: true, depthLimit: 0 });
  return files.reduce((acc, f) => {
    const fileName = path.basename(f.path);
    const content = fs.readFileSync(f.path, ENCODING);
    return { ...acc, [fileName]: content };
  }, {});
}

export function createFileSystemExampleTest<TExampleInput>(
  example: TestFileSystemExample<TExampleInput>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testedFunctionCall: () => any
): Fn0<Promise<void>> {
  return () => doFileSystemExampleTest(example, testedFunctionCall);
}

async function doFileSystemExampleTest<TExampleInput>(
  example: TestFileSystemExample<TExampleInput>,
  testedFunctionCall: () => string
): Promise<void> {
  if (example.expected) {
    const actual = toTestJsonFileContent(testedFunctionCall());
    expect(actual).toEqual(example.expected);
  } else {
    expect(testedFunctionCall).toThrow();
  }
}
