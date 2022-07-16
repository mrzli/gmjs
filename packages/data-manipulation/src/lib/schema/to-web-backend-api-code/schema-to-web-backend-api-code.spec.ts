import { schemaToWebBackendApiCode } from './schema-to-web-backend-api-code';
import path from 'path';
import { SchemaToWebBackendApiCodeInput } from './schema-to-web-backend-api-code-input';
import { readJsonSync } from '@gmjs/fs-util';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  createCodeFileComparisonStrings,
  createCodeFileExpected,
} from '../../shared/test-util';

describe('schema-to-web-backend-api-code', () => {
  it('schemaToWebBackendApiCode()', () => {
    const testDir = path.join(__dirname, 'test-assets');

    const input = createInput(testDir);
    const actual = schemaToWebBackendApiCode(input);
    const expected = createCodeFileExpected(testDir);

    const { expectedString, actualString } = createCodeFileComparisonStrings(
      actual,
      expected
    );

    expect(actualString).toEqual(expectedString);
  });
});

function createInput(testDir: string): SchemaToWebBackendApiCodeInput {
  const schemas = readJsonSync<readonly MongoJsonSchemaTypeObject[]>(
    path.join(testDir, 'input/schemas.json')
  );

  return {
    schemas,
    options: {
      appsMonorepo: {
        npmScope: 'gmjs-apps',
        libsDir: 'libs',
        baseProjectName: 'example',
      },
      interfacePrefixes: {
        db: 'db',
        app: 'app',
      },
    },
  };
}
