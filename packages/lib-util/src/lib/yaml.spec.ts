import path from 'path';
import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import { parseYaml } from './yaml';
import { JsonObject } from 'type-fest';
import { jsonToPretty, textToJson } from './transformations';
import { identifyFn } from '@gmjs/util';

describe('yaml', () => {
  describe('parseYaml()', () => {
    interface TestInput {
      readonly yaml: string;
      readonly jsonSchema?: JsonObject;
    }

    const exampleMapping: ExampleMappingFn<TestInput, string> = (te) => {
      const schemaFile = te.files['schema.json'];
      return {
        description: te.dir,
        input: {
          yaml: te.files['input.yaml'],
          jsonSchema: schemaFile ? textToJson(schemaFile) : undefined,
        },
        expected: te.files['result.json'],
      };
    };

    const PARSE_YAML_EXAMPLES = getFileSystemTestExamples<TestInput, string>(
      path.join(__dirname, 'test-assets/parse-yaml'),
      exampleMapping
    );

    PARSE_YAML_EXAMPLES.forEach((example) => {
      it(
        example.description,
        createFileSystemExampleTest(
          example,
          () =>
            parseYaml(example.input.yaml, {
              jsonSchema: example.input.jsonSchema,
            }),
          jsonToPretty,
          identifyFn
        )
      );
    });
  });
});
