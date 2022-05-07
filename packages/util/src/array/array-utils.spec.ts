import { arrayGetPrimitiveDuplicates, flatMap } from './array-utils';
import { Nullish, SimpleValue } from '../types/generic';

describe('array-utils', () => {
  describe('arrayGetPrimitiveDuplicates()', () => {
    interface Example {
      readonly input: readonly Nullish<SimpleValue>[];
      readonly expected: readonly Nullish<SimpleValue>[];
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [0, false, '', undefined, null],
        expected: [],
      },
      {
        input: [1, '1'],
        expected: [],
      },
      {
        input: [1, 2, 3],
        expected: [],
      },
      {
        input: ['a', 'b', 'c'],
        expected: [],
      },
      {
        input: [true, false],
        expected: [],
      },
      {
        input: ['', ' '],
        expected: [],
      },
      {
        input: [1, 2, 1],
        expected: [1],
      },
      {
        input: [true, false, true],
        expected: [true],
      },
      {
        input: ['a', 'b', 'a'],
        expected: ['a'],
      },
      {
        input: [1, 2, 1, 1],
        expected: [1],
      },
      {
        input: [1, 2, 1, 2],
        expected: [1, 2],
      },
      {
        input: [2, 1, 2, 1],
        expected: [2, 1],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        expect(arrayGetPrimitiveDuplicates(example.input)).toEqual(
          example.expected
        );
      });
    });
  });

  describe('flatMap()', () => {
    describe('without index', () => {
      const MAPPER = (value: number): readonly string[] => [
        `${value}-1`,
        `${value}-2`,
      ];

      interface Example {
        readonly input: readonly number[];
        readonly expected: readonly string[];
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: [],
          expected: [],
        },
        {
          input: [1],
          expected: ['1-1', '1-2'],
        },
        {
          input: [1, 1],
          expected: ['1-1', '1-2', '1-1', '1-2'],
        },
        {
          input: [1, 2, 3],
          expected: ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2'],
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const actual = flatMap(example.input, MAPPER);
          expect(actual).toEqual(example.expected);
        });
      });
    });

    it('with index', () => {
      const actual = flatMap(['a', 'b'], (item, index) => [
        `first-${item}-${index}`,
        `second-${item}-${index}`,
      ]);
      expect(actual).toEqual([
        'first-a-0',
        'second-a-0',
        'first-b-1',
        'second-b-1',
      ]);
    });
  });
});
