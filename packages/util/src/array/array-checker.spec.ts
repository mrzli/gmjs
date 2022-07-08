import {
  arrayHasPrimitiveDuplicates,
  isArrayWithPrimitivesEqual,
} from './array-checker';
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

  describe('isArrayWithPrimitivesEqual()', () => {
    interface Example {
      readonly input: {
        readonly array1: readonly SimpleValue[];
        readonly array2: readonly SimpleValue[];
      };
      readonly expected: boolean;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          array1: [],
          array2: [],
        },
        expected: true,
      },
      {
        input: {
          array1: [],
          array2: [1],
        },
        expected: false,
      },
      {
        input: {
          array1: [1],
          array2: [1],
        },
        expected: true,
      },
      {
        input: {
          array1: ['value'],
          array2: ['value'],
        },
        expected: true,
      },
      {
        input: {
          array1: [1],
          array2: ['1'],
        },
        expected: false,
      },
      {
        input: {
          array1: [1, 2],
          array2: [1, 2],
        },
        expected: true,
      },
      {
        input: {
          array1: [1],
          array2: [1, 2],
        },
        expected: false,
      },
      {
        input: {
          array1: [1, 2],
          array2: [2, 1],
        },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = isArrayWithPrimitivesEqual(
          example.input.array1,
          example.input.array2
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
