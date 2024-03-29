import {
  arrayFilterOutNullish,
  arrayGetPrimitiveDuplicates,
  arrayReverse,
  distinctItems,
  distinctItemsBy,
  mapWithSeparators,
} from './array-utils';
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

  describe('distinctItems()', () => {
    describe('will work for simple types', () => {
      interface Example {
        readonly input: readonly number[];
        readonly expected: readonly number[];
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: [],
          expected: [],
        },
        {
          input: [1],
          expected: [1],
        },
        {
          input: [1, 2],
          expected: [1, 2],
        },
        {
          input: [2, 1],
          expected: [2, 1],
        },
        {
          input: [1, 1],
          expected: [1],
        },
        {
          input: [1, 2, 2, 3],
          expected: [1, 2, 3],
        },
        {
          input: [1, 2, 3, 2],
          expected: [1, 2, 3],
        },
        {
          input: [1, 2, 3, 3, 2],
          expected: [1, 2, 3],
        },
        {
          input: [2, 1, 1, 2, 3],
          expected: [2, 1, 3],
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(distinctItems(example.input)).toEqual(example.expected);
        });
      });
    });

    describe('will not work for object items', () => {
      interface ExampleObject {
        readonly value: number;
      }

      interface Example {
        readonly input: readonly ExampleObject[];
        readonly expected: readonly ExampleObject[];
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: [{ value: 1 }, { value: 1 }],
          expected: [{ value: 1 }, { value: 1 }],
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(distinctItems(example.input)).toEqual(example.expected);
        });
      });
    });

    describe('will not work for array items', () => {
      interface Example {
        readonly input: readonly number[][];
        readonly expected: readonly number[][];
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: [[1], [1]],
          expected: [[1], [1]],
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(distinctItems(example.input)).toEqual(example.expected);
        });
      });
    });
  });

  describe('distinctItemsBy()', () => {
    interface ExampleObject {
      readonly value: number;
      readonly otherValue: number;
    }

    interface Example {
      readonly input: readonly ExampleObject[];
      readonly expected: readonly ExampleObject[];
    }

    function distinctBy(value: ExampleObject): number {
      return value.value;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [{ value: 1, otherValue: 1 }],
        expected: [{ value: 1, otherValue: 1 }],
      },
      {
        input: [
          { value: 1, otherValue: 1 },
          { value: 1, otherValue: 1 },
        ],
        expected: [{ value: 1, otherValue: 1 }],
      },
      {
        input: [
          { value: 1, otherValue: 1 },
          { value: 1, otherValue: 2 },
        ],
        expected: [{ value: 1, otherValue: 1 }],
      },
      {
        input: [
          { value: 1, otherValue: 1 },
          { value: 2, otherValue: 1 },
        ],
        expected: [
          { value: 1, otherValue: 1 },
          { value: 2, otherValue: 1 },
        ],
      },
      {
        input: [
          { value: 1, otherValue: 1 },
          { value: 1, otherValue: 2 },
          { value: 3, otherValue: 6 },
          { value: 2, otherValue: 4 },
          { value: 2, otherValue: 3 },
          { value: 3, otherValue: 5 },
        ],
        expected: [
          { value: 1, otherValue: 1 },
          { value: 3, otherValue: 6 },
          { value: 2, otherValue: 4 },
        ],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        expect(distinctItemsBy(example.input, distinctBy)).toEqual(
          example.expected
        );
      });
    });
  });

  describe('mapWithSeparators()', () => {
    interface Example {
      readonly input: readonly number[];
      readonly expected: readonly string[];
    }

    const MAPPING = (item: number): string => `${item.toString()}x`;
    const SEPARATOR = (index: number): string => `sep${index}`;

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [1],
        expected: ['1x'],
      },
      {
        input: [1, 2],
        expected: ['1x', 'sep0', '2x'],
      },
      {
        input: [1, 2, 3],
        expected: ['1x', 'sep0', '2x', 'sep1', '3x'],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = mapWithSeparators(example.input, MAPPING, SEPARATOR);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('arrayFilterOutNullish()', () => {
    interface Example {
      readonly input: readonly unknown[];
      readonly expected: readonly unknown[];
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [undefined],
        expected: [],
      },
      {
        input: [null],
        expected: [],
      },
      {
        input: [0],
        expected: [0],
      },
      {
        input: [''],
        expected: [''],
      },
      {
        input: [false],
        expected: [false],
      },
      {
        input: [{}],
        expected: [{}],
      },
      {
        input: [[]],
        expected: [[]],
      },
      {
        input: ['value', '', undefined, 11, 0, null, {}, [], true, false],
        expected: ['value', '', 11, 0, {}, [], true, false],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = arrayFilterOutNullish(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('arrayReverse()', () => {
    interface Example {
      readonly input: readonly number[];
      readonly expected: {
        readonly updated: readonly number[];
        readonly original: readonly number[];
      };
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: {
          updated: [],
          original: [],
        },
      },
      {
        input: [1],
        expected: {
          updated: [1],
          original: [1],
        },
      },
      {
        input: [1, 3, 5],
        expected: {
          updated: [5, 3, 1],
          original: [1, 3, 5],
        },
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const original = example.input;
        const actual = arrayReverse(example.input);
        expect(original).toEqual(example.expected.original);
        expect(actual).toEqual(example.expected.updated);
      });
    });
  });
});
