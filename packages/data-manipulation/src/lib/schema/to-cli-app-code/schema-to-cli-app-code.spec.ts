import { schemaToCliAppCode } from './schema-to-cli-app-code';
import path from 'path';
import { SchemaToCliAppCodeInput } from './schema-to-cli-app-code-input';
import { readJsonSync } from '@gmjs/fs-util';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  createCodeFileComparisonStrings,
  createCodeFileExpectedWithPathMapping,
} from '../../shared/test-util';
import { TEST_APPS_MONOREPO_OPTIONS } from '../shared/test-util';
import { DEFAULT_CODE_GENERATION_LIB_MODULE_NAMES } from '../shared/constants';

describe('schema-to-cli-app-code', () => {
  it('schemaToCliAppCode()', () => {
    const testDir = path.join(__dirname, 'test-assets');

    const input = createInput(testDir);
    const actual = schemaToCliAppCode(input);
    const expected = createCodeFileExpectedWithPathMapping(testDir);

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
      appsMonorepo: TEST_APPS_MONOREPO_OPTIONS,
      libModuleNames: DEFAULT_CODE_GENERATION_LIB_MODULE_NAMES,
    },
  };
}
