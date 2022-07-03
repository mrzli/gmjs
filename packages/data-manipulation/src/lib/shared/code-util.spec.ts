import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import path from 'path';
import { identifyFn, ImmutableMap } from '@gmjs/util';
import { processTsSourceFile } from './source-file-util';

describe('code-util', () => {
  describe('processSourceFile()', () => {
    const exampleMapping: ExampleMappingFn<string> = (te) => {
      return {
        description: te.dir,
        input: te.files['input.txt'],
        expected: te.files['result.txt'],
      };
    };

    const EXAMPLES = getFileSystemTestExamples<string>(
      path.join(__dirname, 'test-assets/process-source-file'),
      exampleMapping
    );

    const PLACEHOLDER_MAP = ImmutableMap.fromTupleArray<string, string>([
      ['<<some-value>>', 'actual-value-3'],
    ]);

    EXAMPLES.forEach((example) => {
      it(
        example.description,
        createFileSystemExampleTest(
          example,
          () => processTsSourceFile(example.input, PLACEHOLDER_MAP),
          identifyFn
        )
      );
    });
  });
});
