import { capitalize } from './string-utils';

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
});
