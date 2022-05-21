import { generateMongoCodeFromSchema } from './generate-mongo-code-from-schema';
import * as path from 'path';
import { GenerateMongoCodeFromSchemaInput } from './util/types';
import { createTestOptions } from './test/test-util';
import { readJsonSync, readTextFilesInDirSync } from '@gmjs/fs-util';
import { MongoJsonSchemaTypeObject } from '../data-model/mongo-json-schema';

describe('generate-mongo-code-from-schema', () => {
  it('generateMongoCodeFromSchema()', () => {
    interface PathAndContent {
      readonly path: string;
      readonly content: string;
    }

    interface PathMapping {
      readonly testFile: string;
      readonly path: string;
    }

    const testDir = path.join(
      __dirname,
      'test/assets/generate-mongo-code-from-schema'
    );

    const testProjDir = path.join(testDir, 'input/proj-root');
    const schemas = readJsonSync<readonly MongoJsonSchemaTypeObject[]>(
      path.join(testDir, 'input/schemas.json')
    );

    const INPUT: GenerateMongoCodeFromSchemaInput = {
      schemas,
      options: createTestOptions(testProjDir),
    };

    const testResultsDir = path.join(testDir, 'results');
    const testResultFilesDir = path.join(testResultsDir, 'files');
    const testResultFiles = readTextFilesInDirSync(testResultFilesDir);

    const pathMapping: readonly PathMapping[] = readJsonSync(
      path.join(testResultsDir, 'path-mapping.json')
    );

    const EXPECTED: readonly PathAndContent[] = pathMapping.map((p) => ({
      path: path.join(testProjDir, p.path),
      content: testResultFiles.files[p.testFile],
    }));

    const actual: readonly PathAndContent[] = generateMongoCodeFromSchema(
      INPUT
    ).map((sf) => ({ path: sf.getFilePath(), content: sf.getFullText() }));
    expect(actual).toEqual(EXPECTED);
  });
});
