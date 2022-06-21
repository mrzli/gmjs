import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import path from 'path';
import { MongoDataToDataInput } from './mongo-data-to-data-input';
import { dataModelToData } from './data-model-to-data';

describe('data-model-to-data', () => {
  describe('dataModelToData()', () => {
    const exampleMapping: ExampleMappingFn<MongoDataToDataInput> = (te) => {
      return {
        description: te.dir,
        input: {
          dataModelYamlContent: te.files['input.yaml'],
          numEntries: 5,
        },
        expected: te.files['result.json'],
      };
    };

    const PARSE_YAML_EXAMPLES = getFileSystemTestExamples<MongoDataToDataInput>(
      path.join(__dirname, 'test-assets/data-model-to-data'),
      exampleMapping
    );

    PARSE_YAML_EXAMPLES.forEach((example) => {
      it(
        example.description,
        createFileSystemExampleTest(example, () =>
          dataModelToData(example.input)
        )
      );
    });
  });
});
