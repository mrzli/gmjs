import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import path from 'path';
import { DataModelToPostmanCollectionInput } from './data-model-to-postman-collection-input';
import { dataModelToPostmanCollection } from './data-model-to-postman-collection';

describe('data-model-to-postman-collection', () => {
  describe('dataModelToPostmanCollection()', () => {
    const exampleMapping: ExampleMappingFn<
      DataModelToPostmanCollectionInput
    > = (te) => {
      return {
        description: te.dir,
        input: {
          dataModelYamlContent: te.files['input.yaml'],
          numEntries: 5,
        },
        expected: te.files['result.json'],
      };
    };

    const PARSE_YAML_EXAMPLES =
      getFileSystemTestExamples<DataModelToPostmanCollectionInput>(
        path.join(__dirname, 'test-assets/data-model-to-postman-collection'),
        exampleMapping
      );

    PARSE_YAML_EXAMPLES.forEach((example) => {
      it(
        example.description,
        createFileSystemExampleTest(example, () =>
          dataModelToPostmanCollection(example.input)
        )
      );
    });
  });
});
