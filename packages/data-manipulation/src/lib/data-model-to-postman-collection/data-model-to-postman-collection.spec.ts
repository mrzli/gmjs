import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import path from 'path';
import { DataModelToPostmanCollectionInput } from './data-model-to-postman-collection-input';
import { dataModelToPostmanCollection } from './data-model-to-postman-collection';
import { jsonToPretty } from '@gmjs/lib-util';

describe('data-model-to-postman-collection', () => {
  describe('dataModelToPostmanCollection()', () => {
    interface TestInput {
      readonly dataModelYamlContent: string;
    }

    const exampleMapping: ExampleMappingFn<TestInput> = (te) => {
      return {
        description: te.dir,
        input: {
          dataModelYamlContent: te.files['input.yaml'],
        },
        expected: te.files['result.json'],
      };
    };

    const PARSE_YAML_EXAMPLES = getFileSystemTestExamples<TestInput>(
      path.join(__dirname, 'test-assets/data-model-to-postman-collection'),
      exampleMapping
    );

    PARSE_YAML_EXAMPLES.forEach((example) => {
      it(
        example.description,
        createFileSystemExampleTest(
          example,
          () => {
            const input: DataModelToPostmanCollectionInput = {
              dataModelYamlContent: example.input.dataModelYamlContent,
              postmanCollectionName: 'TestProject',
            };
            return dataModelToPostmanCollection(input);
          },
          jsonToPretty
        )
      );
    });
  });
});
