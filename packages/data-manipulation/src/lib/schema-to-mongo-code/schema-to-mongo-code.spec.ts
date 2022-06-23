import { schemaToMongoCode } from './schema-to-mongo-code';
import path from 'path';
import {
  SchemaToMongoCodeInput,
  SchemaToMongoCodeOptions,
  SchemaToMongoCodeTestOverrides,
} from './schema-to-mongo-code-input';
import { readJsonSync, readTextFilesInDirSync } from '@gmjs/fs-util';
import { MongoJsonSchemaTypeObject } from '../data-model-to-schema/mongo-json-schema';
import { emptyFn, flatMap, ImmutableMap, ImmutableSet } from '@gmjs/util';

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

    const testDir = path.join(__dirname, 'test-assets');

    const testProjDir = path.join(testDir, 'input/proj-root');
    const schemas = readJsonSync<readonly MongoJsonSchemaTypeObject[]>(
      path.join(testDir, 'input/schemas.json')
    );

    const INPUT: SchemaToMongoCodeInput = {
      schemas,
      options: createTestOptions(testProjDir),
    };

    const TEST_OVERRIDES: SchemaToMongoCodeTestOverrides = {
      getInitialFilePath: (basePath: string) => basePath + '_',
      saveTsMorphProject: emptyFn,
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
      schemaToMongoCode(INPUT, TEST_OVERRIDES).map((sf) => ({
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

export const TEST_OPTIONS: SchemaToMongoCodeOptions = {
  rootDir: '/root-dir',
  libsMonorepoNames: {
    npmScope: 'gmjs',
    utilProjectName: 'util',
    nestUtilProjectName: 'nest-util',
  },
  appsMonorepo: {
    npmScope: 'gmjs-apps',
    libsDir: 'libs',
    appsDir: 'apps',
    dbInterfaceOptions: {
      dir: 'db',
      prefix: 'db',
    },
    appInterfaceOptions: {
      dir: 'app',
      prefix: 'app',
    },
    sharedProject: {
      projectName: 'example-shared',
      sharedInterfacesDir: 'src/lib/mongo',
      indexFilePath: 'src/index.ts',
    },
    appProject: {
      projectName: 'example-be',
      appDir: 'src/app',
    },
  },
};

export function createTestOptions(rootDir: string): SchemaToMongoCodeOptions {
  return { ...TEST_OPTIONS, rootDir };
}
