import { arrayMutateRemoveSingleItemByEquals } from './array-mutation';

describe('array-mutation', () => {
  describe('arrayMutateRemoveSingleItemByEquals()', () => {
    interface Example {
      readonly input: {
        readonly array: string[];
        readonly item: string;
      };
      readonly expected: string[];
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          array: [],
          item: '',
        },
        expected: [],
      },
      {
        input: {
          array: ['a'],
          item: '',
        },
        expected: ['a'],
      },
      {
        input: {
          array: ['a', 'b'],
          item: 'non-existing-value',
        },
        expected: ['a', 'b'],
      },
      {
        input: {
          array: ['a', 'b'],
          item: 'a',
        },
        expected: ['b'],
      },
      {
        input: {
          array: ['a', 'b'],
          item: 'b',
        },
        expected: ['a'],
      },
      {
        input: {
          array: ['a', 'b', 'a', 'b'],
          item: 'a',
        },
        expected: ['b', 'a', 'b'],
      },
      {
        input: {
          array: ['a', 'b', 'a', 'b'],
          item: 'b',
        },
        expected: ['a', 'a', 'b'],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const array = [...example.input.array];
        arrayMutateRemoveSingleItemByEquals(array, example.input.item);
        expect(array).toEqual(example.expected);
      });
    });
  });
});
