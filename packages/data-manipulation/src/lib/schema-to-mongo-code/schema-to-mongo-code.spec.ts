import { schemaToMongoCode } from './schema-to-mongo-code';
import path from 'path';
import { SchemaToMongoCodeInput } from './input-types';
import { createTestOptions } from './test/test-util';
import { readJsonSync, readTextFilesInDirSync } from '@gmjs/fs-util';
import { MongoJsonSchemaTypeObject } from '../data-model/mongo-json-schema';
import { flatMap, ImmutableMap, ImmutableSet } from '@gmjs/util';

describe('schema-to-mongo-code', () => {
  it('schemaToMongoCode()', () => {
    interface PathAndContent {
      readonly path: string;
      readonly content: string | undefined;
    }

    interface PathMapping {
      readonly testFile: string;
      readonly path: string;
    }

    const TEXT_DELIMITER = '-'.repeat(20);
    const MISSING_FILE_TEXT = '<MISSING_FILE>';

    function createComparisonText(
      pathAndContentList: readonly PathAndContent[]
    ): string {
      const contentParts = flatMap(pathAndContentList, (item) => [
        TEXT_DELIMITER,
        `File path: ${item.path}`,
        TEXT_DELIMITER,
        item.content ?? MISSING_FILE_TEXT,
        TEXT_DELIMITER,
      ]);
      return contentParts.join('\n');
    }

    const testDir = path.join(__dirname, 'test/assets/schema-to-mongo-code');

    const testProjDir = path.join(testDir, 'input/proj-root');
    const schemas = readJsonSync<readonly MongoJsonSchemaTypeObject[]>(
      path.join(testDir, 'input/schemas.json')
    );

    const INPUT: SchemaToMongoCodeInput = {
      schemas,
      options: createTestOptions(testProjDir),
    };

    const testResultsDir = path.join(testDir, 'results');
    const testResultFilesDir = path.join(testResultsDir, 'files');
    const testResultFiles = readTextFilesInDirSync(testResultFilesDir);

    const pathMapping: readonly PathMapping[] = readJsonSync(
      path.join(testResultsDir, 'path-mapping.json')
    );

    const expectedPathAndContentList: readonly PathAndContent[] =
      pathMapping.map((p) => ({
        path: path.join(testProjDir, p.path),
        content: testResultFiles.files[p.testFile],
      }));

    const actualPathAndContentList: readonly PathAndContent[] =
      schemaToMongoCode(INPUT).map((sf) => ({
        path: sf.getFilePath(),
        content: sf.getFullText(),
      }));

    const expectedPathsSet = ImmutableSet.fromArrayWithFieldMapping(
      expectedPathAndContentList,
      'path'
    );

    const finalExpectedPathAndContentList: readonly PathAndContent[] =
      expectedPathAndContentList.concat(
        actualPathAndContentList.filter(
          (item) => !expectedPathsSet.has(item.path)
        )
      );

    const actualPathsAndContentMap = ImmutableMap.fromArrayWithKeyField(
      actualPathAndContentList,
      'path'
    );

    const finalActualPathAndContentList: readonly PathAndContent[] =
      finalExpectedPathAndContentList.map((item) => ({
        path: item.path,
        content: actualPathsAndContentMap.get(item.path)?.content,
      }));

    const expected = createComparisonText(finalExpectedPathAndContentList);
    const actual = createComparisonText(finalActualPathAndContentList);

    expect(actual).toEqual(expected);
  });
});
