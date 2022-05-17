import * as path from 'path';

import {
  getTestFileSystemExamples,
  TestFileSystemExample,
} from './file-system';

describe('file-system', () => {
  it('getTestFileSystemExamples()', () => {
    const TEST_EXAMPLES_ROOT_DIR = path.join(
      __dirname,
      'test-assets',
      'file-system'
    );

    const EXPECTED: readonly TestFileSystemExample[] = [
      {
        dir: 'example-00',
        files: {
          'file1.txt': 'example00-file1\n',
          'file2.txt': 'example00-file2\n',
        },
      },
      {
        dir: 'example-01',
        files: {
          'file1.txt': 'example01-file1\n',
          'file3.txt': 'example01-file3\n',
        },
      },
    ];

    const actual = getTestFileSystemExamples(TEST_EXAMPLES_ROOT_DIR);
    expect(actual).toEqual(EXPECTED);
  });
});
