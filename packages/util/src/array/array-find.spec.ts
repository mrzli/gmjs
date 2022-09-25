import { arrayFindLastIndexByPredicate } from './array-find';

describe('array-find', () => {
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
