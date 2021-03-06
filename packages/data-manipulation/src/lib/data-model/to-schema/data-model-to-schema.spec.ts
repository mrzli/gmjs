import path from 'path';
import { dataModelToSchema } from './data-model-to-schema';
import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import { jsonToPretty } from '@gmjs/lib-util';

describe('data-model-to-schema', () => {
  describe('dataModelToSchema()', () => {
    interface TestInput {
      readonly dataModelYaml: string;
    }

    const exampleMapping: ExampleMappingFn<TestInput> = (te) => {
      return {
        description: te.dir,
        input: {
          dataModelYaml: te.files['input.yaml'],
        },
        expected: te.files['result.json'],
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
          () => dataModelToSchema(example.input.dataModelYaml),
          jsonToPretty
        )
      );
    });
  });
});
