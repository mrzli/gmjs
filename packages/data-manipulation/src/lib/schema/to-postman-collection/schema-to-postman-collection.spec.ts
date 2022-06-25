import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import path from 'path';
import { SchemaToPostmanCollectionInput } from './schema-to-postman-collection-input';
import { schemaToPostmanCollection } from './schema-to-postman-collection';
import { jsonToPretty, textToJson } from '@gmjs/lib-util';
import { identifyFn } from '@gmjs/util';
import { MongoJsonSchemaTypeObject } from '../../shared/mongo-json-schema';

describe('schema-to-postman-collection', () => {
  describe('schemaToPostmanCollection()', () => {
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
              schemas: example.input.schemas,
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
