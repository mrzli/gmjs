import { capitalize, trim, trimEnd, trimStart } from './string-utils';

describe('string-utils', () => {
  describe('capitalize()', () => {
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
        input: ' ',
        expected: ' ',
      },
      {
        input: ' input',
        expected: ' input',
      },
      {
        input: ' input ',
        expected: ' input ',
      },
      {
        input: 'input',
        expected: 'Input',
      },
      {
        input: 'INPUT',
        expected: 'Input',
      },
      {
        input: 'INPUT',
        expected: 'Input',
      },
      {
        input: 'only first gets capitalized',
        expected: 'Only first gets capitalized',
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = capitalize(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('trim', () => {
    interface Example {
      readonly input: {
        readonly value: string;
        readonly chars: string;
      };
      readonly expected: unknown;
    }

    describe('trimStart()', () => {
      const EXAMPLES: readonly Example[] = [
        {
          input: {
            value: '',
            chars: '',
          },
          expected: '',
        },
        {
          input: {
            value: '',
            chars: 'a',
          },
          expected: '',
        },
        {
          input: {
            value: ' b ',
            chars: 'a',
          },
          expected: ' b ',
        },
        {
          input: {
            value: ' a ',
            chars: 'a',
          },
          expected: ' a ',
        },
        {
          input: {
            value: ' a',
            chars: 'a',
          },
          expected: ' a',
        },
        {
          input: {
            value: 'a ',
            chars: 'a',
          },
          expected: ' ',
        },
        {
          input: {
            value: 'aabbaa',
            chars: 'a',
          },
          expected: 'bbaa',
        },
        {
          input: {
            value: 'AAbbAA',
            chars: 'a',
          },
          expected: 'AAbbAA',
        },
        {
          input: {
            value: 'aabbccbbaa',
            chars: 'ab',
          },
          expected: 'ccbbaa',
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const actual = trimStart(example.input.value, example.input.chars);
          expect(actual).toEqual(example.expected);
        });
      });
    });

    describe('trimEnd()', () => {
      const EXAMPLES: readonly Example[] = [
        {
          input: {
            value: '',
            chars: '',
          },
          expected: '',
        },
        {
          input: {
            value: '',
            chars: 'a',
          },
          expected: '',
        },
        {
          input: {
            value: ' b ',
            chars: 'a',
          },
          expected: ' b ',
        },
        {
          input: {
            value: ' a ',
            chars: 'a',
          },
          expected: ' a ',
        },
        {
          input: {
            value: ' a',
            chars: 'a',
          },
          expected: ' ',
        },
        {
          input: {
            value: 'a ',
            chars: 'a',
          },
          expected: 'a ',
        },
        {
          input: {
            value: 'aabbaa',
            chars: 'a',
          },
          expected: 'aabb',
        },
        {
          input: {
            value: 'AAbbAA',
            chars: 'a',
          },
          expected: 'AAbbAA',
        },
        {
          input: {
            value: 'aabbccbbaa',
            chars: 'ab',
          },
          expected: 'aabbcc',
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const actual = trimEnd(example.input.value, example.input.chars);
          expect(actual).toEqual(example.expected);
        });
      });
    });

    describe('trim()', () => {
      const EXAMPLES: readonly Example[] = [
        {
          input: {
            value: '',
            chars: '',
          },
          expected: '',
        },
        {
          input: {
            value: '',
            chars: 'a',
          },
          expected: '',
        },
        {
          input: {
            value: ' b ',
            chars: 'a',
          },
          expected: ' b ',
        },
        {
          input: {
            value: ' a ',
            chars: 'a',
          },
          expected: ' a ',
        },
        {
          input: {
            value: ' a',
            chars: 'a',
          },
          expected: ' ',
        },
        {
          input: {
            value: 'a ',
            chars: 'a',
          },
          expected: ' ',
        },
        {
          input: {
            value: 'aabbaa',
            chars: 'a',
          },
          expected: 'bb',
        },
        {
          input: {
            value: 'AAbbAA',
            chars: 'a',
          },
          expected: 'AAbbAA',
        },
        {
          input: {
            value: 'aabbccbbaa',
            chars: 'ab',
          },
          expected: 'cc',
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const actual = trim(example.input.value, example.input.chars);
          expect(actual).toEqual(example.expected);
        });
      });
    });
  });
});
