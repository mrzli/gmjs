import path from 'path';
import {
  PathContentPair,
  readJsonSync,
  readTextFilesInDirSync,
} from '@gmjs/fs-util';
import { flatMap, ImmutableMap, ImmutableSet } from '@gmjs/util';

interface TestPathMapping {
  readonly testFile: string;
  readonly path: string;
}

export function createCodeFileExpected(
  testDir: string
): readonly PathContentPair[] {
  const testResultsDir = path.join(testDir, 'results');
  const testResultFilesDir = path.join(testResultsDir, 'files');
  const testResultFiles = readTextFilesInDirSync(testResultFilesDir);

  const pathMapping: readonly TestPathMapping[] = readJsonSync(
    path.join(testResultsDir, 'path-mapping.json')
  );

  return pathMapping.map((p) => ({
    path: p.path,
    content: testResultFiles.files[p.testFile],
  }));
}

const TEXT_DELIMITER = '-'.repeat(20);

export function createCodeFileComparisonText(
  codeFiles: readonly PathContentPair[]
): string {
  const contentParts = flatMap(codeFiles, (item) => [
    TEXT_DELIMITER,
    `File path: ${item.path}`,
    TEXT_DELIMITER,
    item.content,
    TEXT_DELIMITER,
  ]);
  return contentParts.join('\n');
}

export interface CodeFileComparisonStrings {
  readonly actualString: string;
  readonly expectedString: string;
}

const MISSING_FILE_TEXT = '<MISSING_FILE>';

export function createCodeFileComparisonStrings(
  actual: readonly PathContentPair[],
  expected: readonly PathContentPair[]
): CodeFileComparisonStrings {
  const expectedPathsSet = ImmutableSet.fromArrayWithFieldMapping(
    expected,
    'path'
  );

  const finalExpected: readonly PathContentPair[] = [
    ...expected,
    ...actual
      .filter((item) => !expectedPathsSet.has(item.path))
      .map((item) => ({
        path: item.path,
        content: MISSING_FILE_TEXT,
      })),
  ];

  const actualPathsMap = ImmutableMap.fromArrayWithKeyField(actual, 'path');

  const finalActual: readonly PathContentPair[] = finalExpected.map((item) => ({
    path: item.path,
    content: actualPathsMap.get(item.path)?.content ?? MISSING_FILE_TEXT,
  }));

  const expectedString = createCodeFileComparisonText(finalExpected);
  const actualString = createCodeFileComparisonText(finalActual);

  return { expectedString, actualString };
}
