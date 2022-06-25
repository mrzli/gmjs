import path from 'path';
import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import { textToJson } from '@gmjs/lib-util';
import { identifyFn } from '@gmjs/util';
import { schemaToSeedDbCode } from './schema-to-seed-db-code';
import { MongoJsonSchemaTypeObject } from '../../shared/mongo-json-schema';
import { SchemaToSeedDbCodeInput } from './schema-to-seed-db-code-input';

describe('schema-to-seed-db-code', () => {
  describe('schemaToSeedDbCode()', () => {
    interface TestInput {
      readonly schemas: readonly MongoJsonSchemaTypeObject[];
    }

    const exampleMapping: ExampleMappingFn<TestInput, string> = (te) => {
      return {
        description: te.dir,
        input: {
          schemas: textToJson<readonly MongoJsonSchemaTypeObject[]>(
            te.files['input.json']
          ),
        },
        expected: te.files['result.txt'],
      };
    };

    const EXAMPLES = getFileSystemTestExamples<TestInput, string>(
      path.join(__dirname, 'test-assets'),
      exampleMapping
    );

    EXAMPLES.forEach((example) => {
      it(
        example.description,
        createFileSystemExampleTest(
          example,
          () => {
            const input: SchemaToSeedDbCodeInput = {
              schemas: example.input.schemas,
              libsMonorepo: {
                npmScope: 'gmjs',
                mongoUtilProjectName: 'mongo-util',
              },
              appsMonorepo: {
                npmScope: 'gmjs-apps',
                sharedLibProjectName: 'example-shared',
              },
            };
            return schemaToSeedDbCode(input);
          },
          identifyFn,
          identifyFn
        )
      );
    });
  });
});
