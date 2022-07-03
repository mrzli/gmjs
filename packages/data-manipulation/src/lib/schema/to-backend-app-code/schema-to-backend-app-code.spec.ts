import { schemaToBackendAppCode } from './schema-to-backend-app-code';
import path from 'path';
import {
  SchemaToBackendAppCodeInitialFiles,
  SchemaToBackendAppCodeInput,
} from './schema-to-backend-app-code-input';
import { readJsonSync, readTextSync } from '@gmjs/fs-util';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  createCodeFileComparisonStrings,
  createCodeFileExpected,
} from '../../shared/test-util';

describe('schema-to-backend-app-code', () => {
  it('schemaToBackendAppCode()', () => {
    const testDir = path.join(__dirname, 'test-assets');

    const input = createInput(testDir);
    const actual = schemaToBackendAppCode(input);
    const expected = createCodeFileExpected(testDir);

    const { expectedString, actualString } = createCodeFileComparisonStrings(
      actual,
      expected
    );

    expect(actualString).toEqual(expectedString);
  });
});

function createInput(testDir: string): SchemaToBackendAppCodeInput {
  const schemas = readJsonSync<readonly MongoJsonSchemaTypeObject[]>(
    path.join(testDir, 'input/schemas.json')
  );
  const initialFiles: SchemaToBackendAppCodeInitialFiles = {
    appModule: readTextSync(path.join(testDir, 'input/app.module.ts.txt')),
  };

  return {
    schemas,
    initialFiles,
    options: {
      libsMonorepo: {
        npmScope: 'gmjs',
        utilProjectName: 'util',
        nestUtilProjectName: 'nest-util',
      },
      appsMonorepo: {
        npmScope: 'gmjs-apps',
        sharedProjectName: 'example-shared',
      },
      dbPrefix: 'db',
      appPrefix: 'app',
    },
  };
}
