import { schemaToSharedLibraryCode } from './schema-to-shared-library-code';
import path from 'path';
import {
  SchemaToSharedLibraryCodeInitialFiles,
  SchemaToSharedLibraryCodeInput,
} from './schema-to-shared-library-code-input';
import { readJsonSync, readTextSync } from '@gmjs/fs-util';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import {
  createCodeFileComparisonStrings,
  createCodeFileExpectedWithPathMapping,
} from '../../shared/test-util';

describe('schema-to-shared-library-code', () => {
  it('schemaToSharedLibraryCode()', () => {
    const testDir = path.join(__dirname, 'test-assets');

    const input = createInput(testDir);
    const actual = schemaToSharedLibraryCode(input);
    const expected = createCodeFileExpectedWithPathMapping(testDir);

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
      interfacePrefixes: {
        db: 'db',
        app: 'app',
      },
    },
  };
}
