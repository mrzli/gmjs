import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import path from 'path';
import { SchemaToPostmanCollectionInput } from './schema-to-postman-collection-input';
import { schemaToPostmanCollection } from './schema-to-postman-collection';
import { jsonToPretty } from '@gmjs/lib-util';
import { identifyFn } from '@gmjs/util';

describe('schema-to-postman-collection', () => {
  describe('schemaToPostmanCollection()', () => {
    interface TestInput {
      readonly schemas: string;
    }

    const exampleMapping: ExampleMappingFn<TestInput, string> = (te) => {
      return {
        description: te.dir,
        input: {
          schemas: te.files['input.json'],
        },
        expected: te.files['result.json'],
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
            const input: SchemaToPostmanCollectionInput = {
              schemas: JSON.parse(example.input.schemas),
              postmanCollectionName: 'TestProject',
            };
            return schemaToPostmanCollection(input);
          },
          jsonToPretty,
          identifyFn
        )
      );
    });
  });
});
