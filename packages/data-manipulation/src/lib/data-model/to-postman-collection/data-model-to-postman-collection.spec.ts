import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import path from 'path';
import { DataModelToPostmanCollectionInput } from './data-model-to-postman-collection-input';
import { dataModelToPostmanCollection } from './data-model-to-postman-collection';
import { jsonToPretty } from '@gmjs/lib-util';
import { identifyFn } from '@gmjs/util';

describe('data-model-to-postman-collection', () => {
  describe('dataModelToPostmanCollection()', () => {
    interface TestInput {
      readonly dataModelYamlContent: string;
    }

    const exampleMapping: ExampleMappingFn<TestInput, string> = (te) => {
      return {
        description: te.dir,
        input: {
          dataModelYamlContent: te.files['input.yaml'],
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
            const input: DataModelToPostmanCollectionInput = {
              dataModelYamlContent: example.input.dataModelYamlContent,
              postmanCollectionName: 'TestProject',
            };
            return dataModelToPostmanCollection(input);
          },
          jsonToPretty,
          identifyFn
        )
      );
    });
  });
});
