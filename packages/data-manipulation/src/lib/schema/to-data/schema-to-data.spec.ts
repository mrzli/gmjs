import path from 'path';
import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import { jsonToPretty } from '@gmjs/lib-util';
import { schemaToJsonData } from './schema-to-data';
import { identifyFn } from '@gmjs/util';

describe('schema-to-data', () => {
  describe('schemaToJsonData()', () => {
    interface TestInput {
      readonly schemaContent: string;
    }

    const exampleMapping: ExampleMappingFn<TestInput, string> = (te) => {
      return {
        description: te.dir,
        input: {
          schemaContent: te.files['input.json'],
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
            const schema = JSON.parse(example.input.schemaContent);
            return schemaToJsonData(schema);
          },
          jsonToPretty,
          identifyFn
        )
      );
    });
  });
});
