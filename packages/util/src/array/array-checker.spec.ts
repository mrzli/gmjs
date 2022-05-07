import { arrayHasPrimitiveDuplicates } from './array-checker';
import { Nullish, SimpleValue } from '../types/generic';

describe('array-checker', () => {
  describe('arrayHasPrimitiveDuplicates()', () => {
    interface Example {
      readonly input: readonly Nullish<SimpleValue>[];
      readonly expected: boolean;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: false,
      },
      {
        input: [0, false, '', undefined, null],
        expected: false,
      },
      {
        input: [1, '1'],
        expected: false,
      },
      {
        input: [1, 2, 3],
        expected: false,
      },
      {
        input: ['a', 'b', 'c'],
        expected: false,
      },
      {
        input: [true, false],
        expected: false,
      },
      {
        input: ['', ' '],
        expected: false,
      },
      {
        input: [1, 2, 1],
        expected: true,
      },
      {
        input: [true, false, true],
        expected: true,
      },
      {
        input: ['a', 'b', 'a'],
        expected: true,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        expect(arrayHasPrimitiveDuplicates(example.input)).toEqual(
          example.expected
        );
      });
    });
  });
});
