import { schemaToCliAppCode } from './schema-to-cli-app-code';
import path from 'path';
import {
  SchemaToCliAppCodeInitialFiles,
  SchemaToCliAppCodeInput,
} from './schema-to-cli-app-code-input';
import { readJsonSync, readTextSync } from '@gmjs/fs-util';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  createCodeFileComparisonStrings,
  createCodeFileExpected,
} from '../../shared/test-util';

describe.skip('schema-to-cli-app-code', () => {
  it('schemaToCliAppCode()', () => {
    const testDir = path.join(__dirname, 'test-assets');

    const input = createInput(testDir);
    const actual = schemaToCliAppCode(input);
    const expected = createCodeFileExpected(testDir);

    const { expectedString, actualString } = createCodeFileComparisonStrings(
      actual,
      expected
    );

    expect(actualString).toEqual(expectedString);
  });
});

function createInput(testDir: string): SchemaToCliAppCodeInput {
  const schemas = readJsonSync<readonly MongoJsonSchemaTypeObject[]>(
    path.join(testDir, 'input/schemas.json')
  );
  const initialFiles: SchemaToCliAppCodeInitialFiles = {
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
