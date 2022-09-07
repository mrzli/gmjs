import { Fn1 } from '../types/function';
import { applyFn, transformPipe } from './function-pipe';
import {
  combineWithEachItem,
  conditionalConvert,
  distinct,
  filter,
  flatten,
  map,
  mapCombineWithEachItem,
  toArray,
} from './transformers';

describe('transformers', () => {
  describe('map()', () => {
    interface Example {
      readonly input: readonly number[];
      readonly expected: readonly string[];
    }

    const MAPPER: Fn1<number, string> = (item: number) => `${item * 2}x`;

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [1],
        expected: ['2x'],
      },
      {
        input: [1, 2, 3],
        expected: ['2x', '4x', '6x'],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, map(MAPPER));
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('flatten()', () => {
    interface Example {
      readonly input: readonly (readonly number[])[];
      readonly expected: readonly number[];
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [[]],
        expected: [],
      },
      {
        input: [[], []],
        expected: [],
      },
      {
        input: [[1]],
        expected: [1],
      },
      {
        input: [[1], [2]],
        expected: [1, 2],
      },
      {
        input: [[1, 2]],
        expected: [1, 2],
      },
      {
        input: [
          [1, 2],
          [3, 4],
        ],
        expected: [1, 2, 3, 4],
      },
      {
        input: [[1, 2], []],
        expected: [1, 2],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, flatten());
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('filter()', () => {
    interface Example {
      readonly input: readonly number[];
      readonly expected: readonly number[];
    }

    const PREDICATE: Fn1<number, boolean> = (item: number) => item % 2 === 0;

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [1],
        expected: [],
      },
      {
        input: [1, 2, 3, 4, 5],
        expected: [2, 4],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, filter(PREDICATE));
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('distinct()', () => {
    interface Example {
      readonly input: {
        readonly input: readonly number[];
        readonly distinctByFn: ((item: number) => number) | undefined;
      };
      readonly expected: readonly number[];
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          input: [],
          distinctByFn: undefined,
        },
        expected: [],
      },
      {
        input: {
          input: [1],
          distinctByFn: undefined,
        },
        expected: [1],
      },
      {
        input: {
          input: [1, 2],
          distinctByFn: undefined,
        },
        expected: [1, 2],
      },
      {
        input: {
          input: [1, 2, 1, 3, 1, 3],
          distinctByFn: undefined,
        },
        expected: [1, 2, 3],
      },
      {
        input: {
          input: [1, 2, 3, 4, 5],
          distinctByFn: (item) => item % 2,
        },
        expected: [1, 2],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(
          example.input.input,
          distinct(example.input.distinctByFn)
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('combineWithEachItem()', () => {
    interface Example {
      readonly input: {
        readonly input: string;
        readonly array: readonly string[];
      };
      readonly expected: readonly string[];
    }

    const COMBINE_FN = (i1: string, i2: string): string => i1 + i2;

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          input: '',
          array: [],
        },
        expected: [],
      },
      {
        input: {
          input: '',
          array: [],
        },
        expected: [],
      },
      {
        input: {
          input: 'a',
          array: [],
        },
        expected: [],
      },
      {
        input: {
          input: '',
          array: ['1', '2', '3'],
        },
        expected: ['1', '2', '3'],
      },
      {
        input: {
          input: 'a',
          array: ['', '', ''],
        },
        expected: ['a', 'a', 'a'],
      },
      {
        input: {
          input: 'a',
          array: ['1', '2', '3'],
        },
        expected: ['a1', 'a2', 'a3'],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(
          example.input.input,
          combineWithEachItem(example.input.array, COMBINE_FN)
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('mapCombineWithEachItem()', () => {
    interface Example {
      readonly input: {
        readonly input: readonly string[];
        readonly array: readonly string[];
      };
      readonly expected: readonly string[];
    }

    const COMBINE_FN = (i1: string, i2: string): string => i1 + i2;

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          input: [],
          array: [],
        },
        expected: [],
      },
      {
        input: {
          input: ['a'],
          array: [],
        },
        expected: [],
      },
      {
        input: {
          input: [],
          array: ['1'],
        },
        expected: [],
      },
      {
        input: {
          input: ['a'],
          array: [''],
        },
        expected: ['a'],
      },
      {
        input: {
          input: [''],
          array: ['1'],
        },
        expected: ['1'],
      },
      {
        input: {
          input: ['a'],
          array: ['1'],
        },
        expected: ['a1'],
      },
      {
        input: {
          input: ['', ''],
          array: ['', ''],
        },
        expected: ['', '', '', ''],
      },
      {
        input: {
          input: ['a', 'b'],
          array: ['1', '2'],
        },
        expected: ['a1', 'a2', 'b1', 'b2'],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(
          example.input.input,
          mapCombineWithEachItem(example.input.array, COMBINE_FN)
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('conditionalConvert()', () => {
    interface Example {
      readonly input: {
        readonly input: string;
        readonly condition: ((input: string) => boolean) | boolean;
      };
      readonly expected: string;
    }

    const CONVERT_FN = (s: string): string => s + 'x';

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          input: 'a',
          condition: false,
        },
        expected: 'a',
      },
      {
        input: {
          input: 'a',
          condition: () => false,
        },
        expected: 'a',
      },
      {
        input: {
          input: 'a',
          condition: true,
        },
        expected: 'ax',
      },
      {
        input: {
          input: 'a',
          condition: () => true,
        },
        expected: 'ax',
      },
      {
        input: {
          input: 'a',
          condition: (input: string) => input === 'a',
        },
        expected: 'ax',
      },
      {
        input: {
          input: 'b',
          condition: (input: string) => input === 'a',
        },
        expected: 'b',
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = applyFn(
          example.input.input,
          conditionalConvert(example.input.condition, CONVERT_FN)
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });

  function getArrayResult<T, U>(
    input: T,
    transformer: Fn1<T, Iterable<U>>
  ): readonly U[] {
    return applyFn(input, transformPipe(transformer, toArray()));
  }
});
