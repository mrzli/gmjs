import { schemaToCliAppCode } from './schema-to-cli-app-code';
import path from 'path';
import { SchemaToCliAppCodeInput } from './schema-to-cli-app-code-input';
import { readJsonSync } from '@gmjs/fs-util';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  createCodeFileComparisonStrings,
  createCodeFileExpected,
} from '../../shared/test-util';

describe('schema-to-cli-app-code', () => {
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

  return {
    schemas,
    options: {
      libsMonorepo: {
        npmScope: 'gmjs',
        utilProjectName: 'util',
        libUtilProjectName: 'lib-util',
        mongoUtilProjectName: 'mongo-util',
      },
      appsMonorepo: {
        npmScope: 'gmjs-apps',
        libsDir: 'libs',
        projectName: 'example',
        sharedLibProjectName: 'example-shared',
      },
    },
  };
}
