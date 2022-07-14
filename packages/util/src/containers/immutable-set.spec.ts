import { ImmutableSet } from './immutable-set';

describe('ImmutableSet', () => {
  it.skip('performance-test', () => {
    let set = ImmutableSet.createEmpty<number>();
    for (let i = 0; i < 1_000_000; i++) {
      set = set.add(i);
      // set = set.remove('1');
    }
  });

  it('createEmpty()', () => {
    const actual: readonly number[] =
      ImmutableSet.createEmpty<number>().toArray();
    expect(actual).toEqual([]);
  });

  describe('fromArray', () => {
    interface ExampleItem {
      readonly keyA: string;
      readonly keyB: string;
    }

    function createExampleItem(index: number): ExampleItem {
      return {
        keyA: `keyA${index}`,
        keyB: `keyB${index}`,
      };
    }

    describe('fromArray()', () => {
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
          input: [2, 1, 3],
          expected: [2, 1, 3],
        },
        {
          input: [2, 1, 1, 3],
          expected: [2, 1, 3],
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const actual = ImmutableSet.fromArray(example.input).toArray();
          expect(actual).toEqual(example.expected);
        });
      });
    });

    describe('fromArrayWithField()', () => {
      interface Example {
        readonly input: {
          readonly array: readonly ExampleItem[];
          readonly keyField: keyof ExampleItem;
        };
        readonly expected: unknown;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            array: [],
            keyField: 'keyA',
          },
          expected: [],
        },
        {
          input: {
            array: [createExampleItem(1)],
            keyField: 'keyA',
          },
          expected: ['keyA1'],
        },
        {
          input: {
            array: [
              createExampleItem(1),
              createExampleItem(2),
              createExampleItem(3),
            ],
            keyField: 'keyA',
          },
          expected: ['keyA1', 'keyA2', 'keyA3'],
        },
        {
          input: {
            array: [
              createExampleItem(1),
              createExampleItem(2),
              createExampleItem(3),
            ],
            keyField: 'keyB',
          },
          expected: ['keyB1', 'keyB2', 'keyB3'],
        },
        {
          input: {
            array: [
              createExampleItem(1),
              createExampleItem(2),
              createExampleItem(2),
              createExampleItem(3),
            ],
            keyField: 'keyA',
          },
          expected: ['keyA1', 'keyA2', 'keyA3'],
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const actual = ImmutableSet.fromArrayWithField(
            example.input.array,
            example.input.keyField
          ).toArray();
          expect(actual).toEqual(example.expected);
        });
      });
    });

    describe('fromArrayWithMapping()', () => {
      const MAPPING_A = (item: ExampleItem): string => item.keyA;
      const MAPPING_B = (item: ExampleItem): string => item.keyB;

      interface Example {
        readonly input: {
          readonly array: readonly ExampleItem[];
          readonly mapping: (item: ExampleItem) => unknown;
        };
        readonly expected: unknown;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            array: [],
            mapping: MAPPING_A,
          },
          expected: [],
        },
        {
          input: {
            array: [createExampleItem(1)],
            mapping: MAPPING_A,
          },
          expected: ['keyA1'],
        },
        {
          input: {
            array: [
              createExampleItem(1),
              createExampleItem(2),
              createExampleItem(3),
            ],
            mapping: MAPPING_A,
          },
          expected: ['keyA1', 'keyA2', 'keyA3'],
        },
        {
          input: {
            array: [
              createExampleItem(1),
              createExampleItem(2),
              createExampleItem(3),
            ],
            mapping: MAPPING_B,
          },
          expected: ['keyB1', 'keyB2', 'keyB3'],
        },
        {
          input: {
            array: [
              createExampleItem(1),
              createExampleItem(2),
              createExampleItem(2),
              createExampleItem(3),
            ],
            mapping: MAPPING_A,
          },
          expected: ['keyA1', 'keyA2', 'keyA3'],
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const actual = ImmutableSet.fromArrayWithMapping(
            example.input.array,
            example.input.mapping
          ).toArray();
          expect(actual).toEqual(example.expected);
        });
      });
    });
  });

  describe('count()', () => {
    interface Example {
      readonly input: readonly number[];
      readonly expected: number;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: 0,
      },
      {
        input: [1],
        expected: 1,
      },
      {
        input: [1, 2],
        expected: 2,
      },
      {
        input: [2, 1, 3],
        expected: 3,
      },
      {
        input: [2, 1, 1, 3],
        expected: 3,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = ImmutableSet.fromArray(example.input).count();
        expect(actual).toEqual(example.expected);
      });
    });
  });

  // toArray() is used to extract values from set other tests, so there are no separate tests for it

  describe('has()', () => {
    interface Example {
      readonly input: {
        readonly initialValues: readonly number[];
        readonly item: number;
      };
      readonly expected: boolean;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          initialValues: [],
          item: 1,
        },
        expected: false,
      },
      {
        input: {
          initialValues: [1],
          item: 1,
        },
        expected: true,
      },
      {
        input: {
          initialValues: [1],
          item: 2,
        },
        expected: false,
      },
      {
        input: {
          initialValues: [1, 2, 3],
          item: 1,
        },
        expected: true,
      },
      {
        input: {
          initialValues: [1, 2, 3],
          item: 2,
        },
        expected: true,
      },
      {
        input: {
          initialValues: [1, 2, 3],
          item: 3,
        },
        expected: true,
      },
      {
        input: {
          initialValues: [1, 2, 3],
          item: 0,
        },
        expected: false,
      },
      {
        input: {
          initialValues: [1, 2, 3],
          item: 4,
        },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const set = ImmutableSet.fromArray(example.input.initialValues);
        expect(set.has(example.input.item)).toEqual(example.expected);
      });
    });
  });

  describe('add()', () => {
    interface Example {
      readonly input: {
        readonly initialValues: readonly number[];
        readonly item: number;
      };
      readonly expected: {
        readonly original: readonly number[];
        readonly updated: readonly number[];
      };
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          initialValues: [],
          item: 1,
        },
        expected: {
          original: [],
          updated: [1],
        },
      },
      {
        input: {
          initialValues: [1],
          item: 1,
        },
        expected: {
          original: [1],
          updated: [1],
        },
      },
      {
        input: {
          initialValues: [1],
          item: 2,
        },
        expected: {
          original: [1],
          updated: [1, 2],
        },
      },
      {
        input: {
          initialValues: [1, 2],
          item: 1,
        },
        expected: {
          original: [1, 2],
          updated: [1, 2],
        },
      },
      {
        input: {
          initialValues: [4, 2, 2, 3],
          item: 1,
        },
        expected: {
          original: [4, 2, 3],
          updated: [4, 2, 3, 1],
        },
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const originalSet = ImmutableSet.fromArray(example.input.initialValues);
        const updatedSet = originalSet.add(example.input.item);
        expect(originalSet.toArray()).toEqual(example.expected.original);
        expect(updatedSet.toArray()).toEqual(example.expected.updated);
      });
    });
  });

  describe('remove()', () => {
    interface Example {
      readonly input: {
        readonly initialValues: readonly number[];
        readonly item: number;
      };
      readonly expected: {
        readonly original: readonly number[];
        readonly updated: readonly number[];
      };
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          initialValues: [],
          item: 1,
        },
        expected: {
          original: [],
          updated: [],
        },
      },
      {
        input: {
          initialValues: [1],
          item: 1,
        },
        expected: {
          original: [1],
          updated: [],
        },
      },
      {
        input: {
          initialValues: [1],
          item: 2,
        },
        expected: {
          original: [1],
          updated: [1],
        },
      },
      {
        input: {
          initialValues: [1, 2],
          item: 1,
        },
        expected: {
          original: [1, 2],
          updated: [2],
        },
      },
      {
        input: {
          initialValues: [4, 2, 2, 3],
          item: 2,
        },
        expected: {
          original: [4, 2, 3],
          updated: [4, 3],
        },
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const originalSet = ImmutableSet.fromArray(example.input.initialValues);
        const updatedSet = originalSet.remove(example.input.item);
        expect(originalSet.toArray()).toEqual(example.expected.original);
        expect(updatedSet.toArray()).toEqual(example.expected.updated);
      });
    });
  });

  describe('clear()', () => {
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
        input: [1, 2],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual: readonly number[] = ImmutableSet.fromArray(example.input)
          .clear()
          .toArray();
        expect(actual).toEqual([]);
      });
    });
  });
});
