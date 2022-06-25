import path from 'path';
import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import { jsonToPretty, textToJson } from '@gmjs/lib-util';
import { schemaToJsonData } from './schema-to-json-data';
import { identifyFn } from '@gmjs/util';
import { MongoJsonSchemaTypeObject } from '../../shared/mongo-json-schema';

describe('schema-to-json-data', () => {
  describe('schemaToJsonData()', () => {
    interface TestInput {
      readonly schema: MongoJsonSchemaTypeObject;
    }

    const exampleMapping: ExampleMappingFn<TestInput, string> = (te) => {
      return {
        description: te.dir,
        input: {
          schema: textToJson<MongoJsonSchemaTypeObject>(te.files['input.json']),
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
          () => schemaToJsonData(example.input.schema),
          jsonToPretty,
          identifyFn
        )
      );
    });
  });
});
