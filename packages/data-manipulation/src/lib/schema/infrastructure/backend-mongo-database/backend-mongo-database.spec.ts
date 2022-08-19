import { backendMongoDatabase } from './backend-mongo-database';
import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import path from 'path';
import { identityFn } from '@gmjs/util';
import { BackendMongoDatabaseInput } from './backend-mongo-database-input';
import { TEST_APPS_MONOREPO_OPTIONS } from '../../shared/test-util';
import { DEFAULT_CODE_GENERATION_LIB_MODULE_NAMES } from '../../shared/constants';

describe('backend-mongo-database', () => {
  describe('backendMongoDatabase()', () => {
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
            const input: BackendMongoDatabaseInput = {
              appModuleFile: example.input.appModule,
              options: {
                appsMonorepo: TEST_APPS_MONOREPO_OPTIONS,
                libModuleNames: DEFAULT_CODE_GENERATION_LIB_MODULE_NAMES,
              },
            };
            return backendMongoDatabase(input);
          },
          identityFn
        )
      );
    });
  });
});
