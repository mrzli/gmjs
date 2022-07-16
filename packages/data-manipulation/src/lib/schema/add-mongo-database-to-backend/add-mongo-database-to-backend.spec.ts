import { addMongoDatabaseToBackend } from './add-mongo-database-to-backend';
import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import path from 'path';
import { identifyFn } from '@gmjs/util';
import { AddMongoDatabaseToBackendInput } from './add-mongo-database-to-backend-input';

describe('add-mongo-database-to-backend', () => {
  describe('addMongoDatabaseToBackend()', () => {
    interface TestInput {
      readonly appModule: string;
    }

    const exampleMapping: ExampleMappingFn<TestInput> = (te) => {
      return {
        description: te.dir,
        input: {
          appModule: te.files['input.txt'],
        },
        expected: te.files['result.txt'],
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
          () => {
            const input: AddMongoDatabaseToBackendInput = {
              appModuleFile: example.input.appModule,
              options: {
                npmScope: 'gmjs-apps',
                libsDir: 'libs',
                baseProjectName: 'example',
              },
            };
            return addMongoDatabaseToBackend(input);
          },
          identifyFn
        )
      );
    });
  });
});
