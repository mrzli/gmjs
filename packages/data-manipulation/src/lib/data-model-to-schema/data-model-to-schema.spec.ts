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

    const PARSE_YAML_EXAMPLES = getFileSystemTestExamples<TestInput>(
      path.join(__dirname, 'test-assets/data-model-to-schema'),
      exampleMapping
    );

    PARSE_YAML_EXAMPLES.forEach((example) => {
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
