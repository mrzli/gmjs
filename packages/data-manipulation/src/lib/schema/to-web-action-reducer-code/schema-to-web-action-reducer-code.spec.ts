import { schemaToWebActionReducerCode } from './schema-to-web-action-reducer-code';
import path from 'path';
import { SchemaToWebActionReducerCodeInput } from './schema-to-web-action-reducer-code-input';
import { readJsonSync } from '@gmjs/fs-util';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  createCodeFileComparisonStrings,
  createCodeFileExpected,
} from '../../shared/test-util';
import { TEST_APPS_MONOREPO_OPTIONS } from '../shared/test-util';
import { DEFAULT_CODE_GENERATION_LIB_MODULE_NAMES } from '../shared/constants';

describe('schema-to-web-action-reducer-code', () => {
  it('schemaToWebActionReducerCode()', () => {
    const testDir = path.join(__dirname, 'test-assets');

    const input = createInput(testDir);
    const actual = schemaToWebActionReducerCode(input);
    const expected = createCodeFileExpected(testDir);

    const { expectedString, actualString } = createCodeFileComparisonStrings(
      actual,
      expected
    );

    expect(actualString).toEqual(expectedString);
  });
});

function createInput(testDir: string): SchemaToWebActionReducerCodeInput {
  const schemas = readJsonSync<readonly MongoJsonSchemaTypeObject[]>(
    path.join(testDir, 'input/schemas.json')
  );

  return {
    schemas,
    options: {
      appsMonorepo: TEST_APPS_MONOREPO_OPTIONS,
      libModuleNames: DEFAULT_CODE_GENERATION_LIB_MODULE_NAMES,
      interfacePrefixes: {
        db: 'db',
        app: 'app',
      },
    },
  };
}
