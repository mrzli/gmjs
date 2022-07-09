import { isInDir, pathDir, pathExtension, pathWithoutExtension } from './path';

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

  describe('pathDir()', () => {
    interface Example {
      readonly input: string;
      readonly expected: string;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: '',
        expected: '',
      },
      {
        input: 'a',
        expected: '',
      },
      {
        input: 'a.ext',
        expected: '',
      },
      {
        input: '/a',
        expected: '/',
      },
      {
        input: 'a/b',
        expected: 'a',
      },
      {
        input: 'a/b.ext',
        expected: 'a',
      },
      {
        input: 'a/b/c.ext',
        expected: 'a/b',
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = pathDir(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('pathWithoutExtension()', () => {
    interface Example {
      readonly input: string;
      readonly expected: string;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: '',
        expected: '.',
      },
      {
        input: 'a',
        expected: 'a',
      },
      {
        input: 'a.ext',
        expected: 'a',
      },
      {
        input: '/a',
        expected: '/a',
      },
      {
        input: 'a/b',
        expected: 'a/b',
      },
      {
        input: 'a/b.ext',
        expected: 'a/b',
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = pathWithoutExtension(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('pathExtension()', () => {
    interface Example {
      readonly input: string;
      readonly expected: string;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: '',
        expected: '',
      },
      {
        input: 'a',
        expected: '',
      },
      {
        input: 'a.ext',
        expected: 'ext',
      },
      {
        input: '/a',
        expected: '',
      },
      {
        input: 'a/b',
        expected: '',
      },
      {
        input: 'a/b.ext',
        expected: 'ext',
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = pathExtension(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
