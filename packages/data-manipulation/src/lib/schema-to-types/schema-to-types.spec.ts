import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import path from 'path';
import { schemaToTypes } from './schema-to-types';
import { identifyFn } from '@gmjs/util';

describe.skip('schema-to-types', () => {
  describe('schemaToTypes()', () => {
    interface TestInput {
      readonly schemaContent: string;
    }

    const exampleMapping: ExampleMappingFn<TestInput> = (te) => {
      return {
        description: te.dir,
        input: {
          schemaContent: te.files['input.json'],
        },
        expected: te.files['result.txt'],
      };
    };

    const PARSE_YAML_EXAMPLES = getFileSystemTestExamples<TestInput>(
      path.join(__dirname, 'test-assets/schema-to-types'),
      exampleMapping
    );

    PARSE_YAML_EXAMPLES.forEach((example) => {
      it(
        example.description,
        createFileSystemExampleTest(
          example,
          () => {
            const schema = JSON.parse(example.input.schemaContent);
            return schemaToTypes({
              prefix: 'PostmanCollection',
              schema,
            });
          },
          identifyFn
        )
      );
    });
  });
});
