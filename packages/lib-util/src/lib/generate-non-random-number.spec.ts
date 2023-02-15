import { stringToNonRandomInteger } from './generate-non-random-number';

describe('generate-non-random-number', () => {
  describe('stringToNonRandomInteger()', () => {
    interface Example {
      readonly input: string;
      readonly expected: number;
    }

    const MIN = 0;
    const MAX = 9;

    const EXAMPLES: readonly Example[] = [
      {
        input: 'value1',
        expected: 3,
      },
      {
        input: 'value2',
        expected: 1,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = stringToNonRandomInteger(example.input, MIN, MAX);
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
