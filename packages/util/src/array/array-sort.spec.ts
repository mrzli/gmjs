import {
  compareFnNumberAsc,
  compareFnNumberDesc,
  compareFnStringAsc,
  compareFnStringDesc,
  sortArray,
} from './array-sort';

describe('array-sort-utils', () => {
  describe('sortArray()', () => {
    describe('number', () => {
      interface Example {
        readonly input: {
          readonly array: readonly number[];
          readonly compareFn: (item1: number, item2: number) => number;
        };
        readonly expected: {
          updated: readonly number[];
          original: readonly number[];
        };
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            array: [],
            compareFn: compareFnNumberAsc,
          },
          expected: {
            updated: [],
            original: [],
          },
        },
        {
          input: {
            array: [1],
            compareFn: compareFnNumberAsc,
          },
          expected: {
            updated: [1],
            original: [1],
          },
        },
        {
          input: {
            array: [1, 2],
            compareFn: compareFnNumberAsc,
          },
          expected: {
            updated: [1, 2],
            original: [1, 2],
          },
        },
        {
          input: {
            array: [3, 1, 2],
            compareFn: compareFnNumberAsc,
          },
          expected: {
            updated: [1, 2, 3],
            original: [3, 1, 2],
          },
        },
        {
          input: {
            array: [3, 1, 2],
            compareFn: compareFnNumberDesc,
          },
          expected: {
            updated: [3, 2, 1],
            original: [3, 1, 2],
          },
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const original = example.input.array;
          const actual = sortArray(original, example.input.compareFn);
          expect(original).toEqual(example.expected.original);
          expect(actual).toEqual(example.expected.updated);
        });
      });
    });

    describe('string', () => {
      interface Example {
        readonly input: {
          readonly array: readonly string[];
          readonly compareFn: (item1: string, item2: string) => number;
        };
        readonly expected: {
          updated: readonly string[];
          original: readonly string[];
        };
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            array: [],
            compareFn: compareFnStringAsc,
          },
          expected: {
            updated: [],
            original: [],
          },
        },
        {
          input: {
            array: ['a'],
            compareFn: compareFnStringAsc,
          },
          expected: {
            updated: ['a'],
            original: ['a'],
          },
        },
        {
          input: {
            array: ['a', 'b'],
            compareFn: compareFnStringAsc,
          },
          expected: {
            updated: ['a', 'b'],
            original: ['a', 'b'],
          },
        },
        {
          input: {
            array: ['A', 'a', 'B', 'b'],
            compareFn: compareFnStringAsc,
          },
          expected: {
            updated: ['A', 'a', 'B', 'b'],
            original: ['A', 'a', 'B', 'b'],
          },
        },
        {
          input: {
            array: ['A', 'a'],
            compareFn: compareFnStringAsc,
          },
          expected: {
            updated: ['A', 'a'],
            original: ['A', 'a'],
          },
        },
        {
          input: {
            array: ['a', 'A'],
            compareFn: compareFnStringAsc,
          },
          expected: {
            updated: ['a', 'A'],
            original: ['a', 'A'],
          },
        },
        {
          input: {
            array: ['b', 'aa'],
            compareFn: compareFnStringAsc,
          },
          expected: {
            updated: ['aa', 'b'],
            original: ['b', 'aa'],
          },
        },
        {
          input: {
            array: ['b', 'aa', 'c'],
            compareFn: compareFnStringDesc,
          },
          expected: {
            updated: ['c', 'b', 'aa'],
            original: ['b', 'aa', 'c'],
          },
        },
        {
          input: {
            array: ['A', 'a'],
            compareFn: compareFnStringDesc,
          },
          expected: {
            updated: ['A', 'a'],
            original: ['A', 'a'],
          },
        },
        {
          input: {
            array: ['a', 'A'],
            compareFn: compareFnStringDesc,
          },
          expected: {
            updated: ['a', 'A'],
            original: ['a', 'A'],
          },
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const original = example.input.array;
          const actual = sortArray(original, example.input.compareFn);
          expect(original).toEqual(example.expected.original);
          expect(actual).toEqual(example.expected.updated);
        });
      });
    });
  });
});
