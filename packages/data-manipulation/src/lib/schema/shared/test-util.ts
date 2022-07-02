import { CodeFileResult } from './code-util';
import path from 'path';
import { readJsonSync, readTextFilesInDirSync } from '@gmjs/fs-util';
import { flatMap, ImmutableMap, ImmutableSet } from '@gmjs/util';

interface TestPathMapping {
  readonly testFile: string;
  readonly path: string;
}

export function createCodeFileExpected(
  testDir: string
): readonly CodeFileResult[] {
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
  codeFiles: readonly CodeFileResult[]
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
  actual: readonly CodeFileResult[],
  expected: readonly CodeFileResult[]
): CodeFileComparisonStrings {
  const expectedPathsSet = ImmutableSet.fromArrayWithFieldMapping(
    expected,
    'path'
  );

  const finalExpected: readonly CodeFileResult[] = [
    ...expected,
    ...actual
      .filter((item) => !expectedPathsSet.has(item.path))
      .map((item) => ({
        path: item.path,
        content: MISSING_FILE_TEXT,
      })),
  ];

  const actualPathsMap = ImmutableMap.fromArrayWithKeyField(actual, 'path');

  const finalActual: readonly CodeFileResult[] = finalExpected.map((item) => ({
    path: item.path,
    content: actualPathsMap.get(item.path)?.content ?? MISSING_FILE_TEXT,
  }));

  const expectedString = createCodeFileComparisonText(finalExpected);
  const actualString = createCodeFileComparisonText(finalActual);

  return { expectedString, actualString };
}
