import { arrayFindLastIndexByPredicate, arrayFindOrThrow } from './array-find';

describe('array-find', () => {
  describe('arrayFindOrThrow()', () => {
    const PREDICATE = (item: number): boolean => item === 5;

    describe('valid', () => {
      interface Example {
        readonly input: readonly number[];
        readonly expected: number;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: [1, 2, 3, 4, 5],
          expected: 5,
        },
        {
          input: [1, 5, 1],
          expected: 5,
        },
        {
          input: [1, 5, 1, 3, 5, 1],
          expected: 5,
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const actual = arrayFindOrThrow(example.input, PREDICATE);
          expect(actual).toEqual(example.expected);
        });
      });
    });

    describe('throws', () => {
      interface Example {
        readonly input: readonly number[];
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: [],
        },
        {
          input: [1],
        },
        {
          input: [1, 2, 3, 4],
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(() =>
            arrayFindOrThrow(example.input, PREDICATE)
          ).toThrowError();
        });
      });
    });
  });

  describe('arrayFindLastIndexByPredicate()', () => {
    const PREDICATE = (item: number): boolean => item === 5;

    interface Example {
      readonly input: readonly number[];
      readonly expected: number;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: -1,
      },
      {
        input: [1, 2],
        expected: -1,
      },
      {
        input: [1, 2, 3, 4, 5],
        expected: 4,
      },
      {
        input: [1, 5, 1],
        expected: 1,
      },
      {
        input: [1, 5, 1, 3, 5, 1],
        expected: 4,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = arrayFindLastIndexByPredicate(example.input, PREDICATE);
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
