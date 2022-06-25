import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import path from 'path';
import { schemaToTypes } from './schema-to-types';
import { AnyValue, identifyFn } from '@gmjs/util';
import { textToJson } from '@gmjs/lib-util';
import { SchemaToTypesInput } from './schema-to-types-input';

describe.skip('schema-to-types', () => {
  describe('schemaToTypes()', () => {
    interface TestInput {
      readonly schema: AnyValue;
    }

    const exampleMapping: ExampleMappingFn<TestInput> = (te) => {
      return {
        description: te.dir,
        input: {
          schema: textToJson(te.files['input.json']),
        },
        expected: te.files['result.txt'],
      };
    };

    const EXAMPLES = getFileSystemTestExamples<TestInput>(
      path.join(__dirname, 'test-assets'),
      exampleMapping
    );

    EXAMPLES.forEach((example) => {
      it(
        example.description,
        createFileSystemExampleTest(
          example,
          () => {
            const input: SchemaToTypesInput = {
              prefix: 'PostmanCollection',
              schema: example.input.schema,
            };
            return schemaToTypes(input);
          },
          identifyFn
        )
      );
    });
  });
});
