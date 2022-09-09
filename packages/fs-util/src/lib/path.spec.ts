import {
  isInDir,
  pathDir,
  pathExtension,
  pathFsName,
  pathFsNameWithExtension,
  pathWithoutExtension,
} from './path';

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

  describe('pathFsName()', () => {
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
        expected: 'a',
      },
      {
        input: 'a.ext',
        expected: 'a',
      },
      {
        input: '/a',
        expected: 'a',
      },
      {
        input: 'a/b',
        expected: 'b',
      },
      {
        input: 'a/b.ext',
        expected: 'b',
      },
      {
        input: 'a/b.ext.ext2',
        expected: 'b.ext',
      },
      {
        input: 'a/b/c.ext',
        expected: 'c',
      },
      {
        input: 'a/b/c.ext.ext2',
        expected: 'c.ext',
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = pathFsName(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('pathFsNameWithExtension()', () => {
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
        expected: 'a',
      },
      {
        input: 'a.ext',
        expected: 'a.ext',
      },
      {
        input: '/a',
        expected: 'a',
      },
      {
        input: 'a/b',
        expected: 'b',
      },
      {
        input: 'a/b.ext',
        expected: 'b.ext',
      },
      {
        input: 'a/b.ext.ext2',
        expected: 'b.ext.ext2',
      },
      {
        input: 'a/b/c.ext',
        expected: 'c.ext',
      },
      {
        input: 'a/b/c.ext.ext2',
        expected: 'c.ext.ext2',
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = pathFsNameWithExtension(example.input);
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
