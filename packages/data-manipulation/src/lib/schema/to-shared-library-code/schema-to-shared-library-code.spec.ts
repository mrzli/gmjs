import { schemaToSharedLibraryCode } from './schema-to-shared-library-code';
import path from 'path';
import {
  SchemaToSharedLibraryCodeInitialFiles,
  SchemaToSharedLibraryCodeInput,
} from './schema-to-shared-library-code-input';
import { readJsonSync, readTextSync } from '@gmjs/fs-util';
import { MongoJsonSchemaTypeObject } from '../../shared/mongo/mongo-json-schema';
import {
  createCodeFileComparisonStrings,
  createCodeFileExpected,
} from '../../shared/test-util';

describe('schema-to-shared-library-code', () => {
  it('schemaToSharedLibraryCode()', () => {
    const testDir = path.join(__dirname, 'test-assets');

    const input = createInput(testDir);
    const actual = schemaToSharedLibraryCode(input);
    const expected = createCodeFileExpected(testDir);

    const { expectedString, actualString } = createCodeFileComparisonStrings(
      actual,
      expected
    );

    expect(actualString).toEqual(expectedString);
  });
});

function createInput(testDir: string): SchemaToSharedLibraryCodeInput {
  const schemas = readJsonSync<readonly MongoJsonSchemaTypeObject[]>(
    path.join(testDir, 'input/schemas.json')
  );
  const initialFiles: SchemaToSharedLibraryCodeInitialFiles = {
    index: readTextSync(path.join(testDir, 'input/index.ts.txt')),
  };

  return {
    schemas,
    initialFiles,
    options: {
      mongoInterfacesDir: 'lib/mongo',
      dbInterfaceOptions: {
        dir: 'db',
        prefix: 'db',
      },
      appInterfaceOptions: {
        dir: 'app',
        prefix: 'app',
      },
    },
  };
}
