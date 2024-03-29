import { Fn1 } from '../../types/function';
import { transformPipe } from '../function-pipe';
import {
  aggregate,
  combineIterables,
  concat,
  distinct,
  duplicates,
  filter,
  filterOutNullish,
  flatMap,
  flatten,
  groupBySimpleKey,
  indexes,
  keys,
  map,
  mapCombineWithEachItem,
  reverse,
  sort,
  tapIterable,
  toMap,
  toSet,
  values,
} from './iterable';
import { getArrayResult } from './test-util';

describe('iterable', () => {
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

  describe('indexes()', () => {
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
        expected: [0],
      },
      {
        input: [1, 2, 3],
        expected: [0, 1, 2],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, indexes());
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

  describe('flatMap()', () => {
    interface Example {
      readonly input: readonly number[];
      readonly expected: readonly string[];
    }

    const MAPPER: Fn1<number, readonly string[]> = (item: number) => [
      `${item * 2}x`,
      `${item * 3}y`,
    ];

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [1],
        expected: ['2x', '3y'],
      },
      {
        input: [1, 2, 3],
        expected: ['2x', '3y', '4x', '6y', '6x', '9y'],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, flatMap(MAPPER));
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

  describe('filterOutNullish()', () => {
    interface Example {
      readonly input: readonly (number | undefined | null)[];
      readonly expected: readonly number[];
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [0],
        expected: [0],
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
        input: [1, undefined, 2, null],
        expected: [1, 2],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, filterOutNullish());
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('concat()', () => {
    interface Example {
      readonly input: {
        readonly input: readonly number[];
        readonly other: readonly number[];
      };
      readonly expected: readonly number[];
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          input: [],
          other: [],
        },
        expected: [],
      },
      {
        input: {
          input: [],
          other: [0],
        },
        expected: [0],
      },
      {
        input: {
          input: [0],
          other: [],
        },
        expected: [0],
      },
      {
        input: {
          input: [0],
          other: [1],
        },
        expected: [0, 1],
      },
      {
        input: {
          input: [0, 1],
          other: [2, 3],
        },
        expected: [0, 1, 2, 3],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(
          example.input.input,
          concat(example.input.other)
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('reverse()', () => {
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
        input: [1, 2, 3, 4, 5],
        expected: [5, 4, 3, 2, 1],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, reverse());
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('sort()', () => {
    interface Example {
      readonly input: readonly number[];
      readonly expected: readonly number[];
    }

    const COMPARE_FN = (item1: number, item2: number) => item1 - item2;

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
        input: [1, 2, 3, 4, 5],
        expected: [1, 2, 3, 4, 5],
      },
      {
        input: [5, 4, 3, 2, 1],
        expected: [1, 2, 3, 4, 5],
      },
      {
        input: [1, 4, 2, 5, 3],
        expected: [1, 2, 3, 4, 5],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, sort(COMPARE_FN));
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('tapIterable()', () => {
    interface Example {
      readonly input: readonly number[];
      readonly expected: {
        readonly sideEffectVar: string;
        readonly output: readonly number[];
      };
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [0],
        expected: {
          sideEffectVar: 'value0',
          output: [0],
        },
      },
      {
        input: [1, 2, 3],
        expected: {
          sideEffectVar: 'value123',
          output: [1, 2, 3],
        },
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        let sideEffectVar = 'value';
        const actual = getArrayResult(
          example.input,
          transformPipe(
            tapIterable((input) => {
              sideEffectVar += input;
            })
          )
        );
        expect(actual).toEqual(example.expected.output);
        expect(sideEffectVar).toEqual(example.expected.sideEffectVar);
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

  describe('duplicates()', () => {
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
        expected: [],
      },
      {
        input: {
          input: [1, 2],
          distinctByFn: undefined,
        },
        expected: [],
      },
      {
        input: {
          input: [1, 2, 1, 3, 1, 3],
          distinctByFn: undefined,
        },
        expected: [1, 1, 3],
      },
      {
        input: {
          input: [1, 2, 3, 4, 5],
          distinctByFn: (item) => item % 2,
        },
        expected: [3, 4, 5],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(
          example.input.input,
          duplicates(example.input.distinctByFn)
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

  describe('combineIterables()', () => {
    describe('valid', () => {
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
          expected: ['', ''],
        },
        {
          input: {
            input: ['a', 'b'],
            array: ['1', '2'],
          },
          expected: ['a1', 'b2'],
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const actual = getArrayResult(
            example.input.input,
            combineIterables(example.input.array, COMBINE_FN)
          );
          expect(actual).toEqual(example.expected);
        });
      });
    });

    describe('throws', () => {
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
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const call = () =>
            getArrayResult(
              example.input.input,
              combineIterables(example.input.array, COMBINE_FN)
            );
          expect(call).toThrow();
        });
      });
    });
  });

  describe('aggregate()', () => {
    type ExampleInputItem = readonly [string, readonly number[]];
    type ExampleOutputItem = readonly [string, number];

    interface Example {
      readonly input: readonly ExampleInputItem[];
      readonly expected: readonly ExampleOutputItem[];
    }

    const AGGREGATE_FN = (input: Iterable<number>): number => {
      let total = 0;
      for (const item of input) {
        total += item;
      }
      return total;
    };

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [['k1', []]],
        expected: [['k1', 0]],
      },
      {
        input: [
          ['k1', []],
          ['k2', []],
        ],
        expected: [
          ['k1', 0],
          ['k2', 0],
        ],
      },
      {
        input: [
          ['k1', [0]],
          ['k2', [1]],
        ],
        expected: [
          ['k1', 0],
          ['k2', 1],
        ],
      },
      {
        input: [
          ['k1', [1, 2]],
          ['k2', [3, 4]],
        ],
        expected: [
          ['k1', 3],
          ['k2', 7],
        ],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(
          new Map<string, readonly number[]>(example.input),
          aggregate(AGGREGATE_FN)
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('groupBySimpleKey()', () => {
    interface ExampleItem {
      readonly key: string;
      readonly value: readonly number[];
    }

    interface Example {
      readonly input: readonly ExampleItem[];
      readonly expected: readonly [string, readonly ExampleItem[]][];
    }

    const KEY_SELECTOR = (item: ExampleItem): string => item.key;

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [{ key: 'k1', value: [] }],
        expected: [['k1', [{ key: 'k1', value: [] }]]],
      },
      {
        input: [
          { key: 'k1', value: [] },
          { key: 'k2', value: [] },
        ],
        expected: [
          ['k1', [{ key: 'k1', value: [] }]],
          ['k2', [{ key: 'k2', value: [] }]],
        ],
      },
      {
        input: [
          { key: 'k1', value: [0] },
          { key: 'k2', value: [1] },
        ],
        expected: [
          ['k1', [{ key: 'k1', value: [0] }]],
          ['k2', [{ key: 'k2', value: [1] }]],
        ],
      },
      {
        input: [
          { key: 'k1', value: [] },
          { key: 'k2', value: [] },
          { key: 'k1', value: [] },
        ],
        expected: [
          [
            'k1',
            [
              { key: 'k1', value: [] },
              { key: 'k1', value: [] },
            ],
          ],
          ['k2', [{ key: 'k2', value: [] }]],
        ],
      },
      {
        input: [
          { key: 'k1', value: [1] },
          { key: 'k2', value: [2] },
          { key: 'k1', value: [3] },
          { key: 'k2', value: [4] },
        ],
        expected: [
          [
            'k1',
            [
              { key: 'k1', value: [1] },
              { key: 'k1', value: [3] },
            ],
          ],
          [
            'k2',
            [
              { key: 'k2', value: [2] },
              { key: 'k2', value: [4] },
            ],
          ],
        ],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(
          example.input,
          groupBySimpleKey(KEY_SELECTOR)
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('keys()', () => {
    interface Example {
      readonly input: Iterable<readonly [number, string]>;
      readonly expected: readonly number[];
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [[1, 'value-1']],
        expected: [1],
      },
      {
        input: [
          [1, 'value-1'],
          [1, 'value-1'],
        ],
        expected: [1, 1],
      },
      {
        input: [
          [1, 'value-1'],
          [2, 'value-2'],
        ],
        expected: [1, 2],
      },
      {
        input: new Map([
          [1, 'value-1'],
          [2, 'value-2'],
        ]),
        expected: [1, 2],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, keys());
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('values()', () => {
    interface Example {
      readonly input: Iterable<readonly [number, string]>;
      readonly expected: readonly string[];
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [[1, 'value-1']],
        expected: ['value-1'],
      },
      {
        input: [
          [1, 'value-1'],
          [1, 'value-1'],
        ],
        expected: ['value-1', 'value-1'],
      },
      {
        input: [
          [1, 'value-1'],
          [2, 'value-2'],
        ],
        expected: ['value-1', 'value-2'],
      },
      {
        input: new Map([
          [1, 'value-1'],
          [2, 'value-2'],
        ]),
        expected: ['value-1', 'value-2'],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, values());
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('toSet()', () => {
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
        input: [0],
        expected: [0],
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
        input: [1, 2, 1, 3],
        expected: [1, 2, 3],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, toSet());
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('toMap()', () => {
    type ExampleItem = readonly [string, number];

    interface Example {
      readonly input: readonly ExampleItem[];
      readonly expected: readonly ExampleItem[];
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [['0', 0]],
        expected: [['0', 0]],
      },
      {
        input: [['1', 1]],
        expected: [['1', 1]],
      },
      {
        input: [
          ['1', 1],
          ['2', 2],
        ],
        expected: [
          ['1', 1],
          ['2', 2],
        ],
      },
      {
        input: [
          ['1', 1],
          ['2', 2],
          ['1', 1],
          ['3', 3],
        ],
        expected: [
          ['1', 1],
          ['2', 2],
          ['3', 3],
        ],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, toMap());
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
