import * as path from 'path';
import { generateMongoJsonSchemas } from './generate-mongo-json-schemas';
import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';

describe('generate-mongo-json-schemas', () => {
  describe('parseYaml()', () => {
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
      path.join(__dirname, 'test-assets/generate-mongo-json-schemas'),
      exampleMapping
    );

    PARSE_YAML_EXAMPLES.forEach((example) => {
      it(
        example.description,
        createFileSystemExampleTest(example, () =>
          generateMongoJsonSchemas(example.input.dataModelYaml)
        )
      );
    });
  });
});
