import { isInDir } from '@gmjs/lib-util';

describe('path', () => {
  describe('isInDir()', () => {
    interface Example {
      readonly input: {
        readonly rootDir: string;
        readonly fsPath: string;
      };
      readonly expected: boolean;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          rootDir: 'a',
          fsPath: 'a/b',
        },
        expected: true,
      },
      {
        input: {
          rootDir: 'a',
          fsPath: 'a/b.ts',
        },
        expected: true,
      },
      {
        input: {
          rootDir: '/a',
          fsPath: '/a/b',
        },
        expected: true,
      },
      {
        input: {
          rootDir: '/a/b/..',
          fsPath: '/a/c',
        },
        expected: true,
      },
      {
        input: {
          rootDir: '/a',
          fsPath: '/a/b/../c',
        },
        expected: true,
      },
      {
        input: {
          rootDir: 'a',
          fsPath: 'a',
        },
        expected: false,
      },
      {
        input: {
          rootDir: '/a',
          fsPath: '/a',
        },
        expected: false,
      },
      {
        input: {
          rootDir: '/a',
          fsPath: '/b',
        },
        expected: false,
      },
      {
        input: {
          rootDir: '/a',
          fsPath: '/a/b/..',
        },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = isInDir(example.input.rootDir, example.input.fsPath);
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
