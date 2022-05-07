import { ImmutableMap, ImmutableMapKeyValuePair } from './immutable-map';

describe('ImmutableMap', () => {
  it.skip('performance-test', () => {
    let map = ImmutableMap.createEmpty<number, string>();
    for (let i = 0; i < 1_000_000; i++) {
      map = map.set(i, '1');
      // map = map.remove('1');
    }
  });

  it('createEmpty()', () => {
    const actual: readonly [string, string][] = ImmutableMap.createEmpty<
      string,
      string
    >().entryTuples();
    expect(actual).toEqual([]);
  });

  describe('fromTupleArray()', () => {
    interface Example {
      readonly input: readonly [string, string][];
      readonly expected: readonly [string, string][];
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [['k1', 'v1']],
        expected: [['k1', 'v1']],
      },
      {
        input: [
          ['k1', 'v1'],
          ['k2', 'v2'],
        ],
        expected: [
          ['k1', 'v1'],
          ['k2', 'v2'],
        ],
      },
      {
        input: [
          ['k2', 'v2'],
          ['k1', 'v1'],
          ['k3', 'v3'],
        ],
        expected: [
          ['k2', 'v2'],
          ['k1', 'v1'],
          ['k3', 'v3'],
        ],
      },
      {
        input: [
          ['k2', 'v2'],
          ['k1', 'v1-1'],
          ['k1', 'v1-2'],
          ['k3', 'v3'],
        ],
        expected: [
          ['k2', 'v2'],
          ['k1', 'v1-2'],
          ['k3', 'v3'],
        ],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = ImmutableMap.fromTupleArray(example.input).entryTuples();
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('fromPairArray()', () => {
    interface Example {
      readonly input: readonly ImmutableMapKeyValuePair<string, string>[];
      readonly expected: readonly [string, string][];
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [{ key: 'k1', value: 'v1' }],
        expected: [['k1', 'v1']],
      },
      {
        input: [
          { key: 'k1', value: 'v1' },
          { key: 'k2', value: 'v2' },
        ],
        expected: [
          ['k1', 'v1'],
          ['k2', 'v2'],
        ],
      },
      {
        input: [
          { key: 'k2', value: 'v2' },
          { key: 'k1', value: 'v1' },
          { key: 'k3', value: 'v3' },
        ],
        expected: [
          ['k2', 'v2'],
          ['k1', 'v1'],
          ['k3', 'v3'],
        ],
      },
      {
        input: [
          { key: 'k2', value: 'v2' },
          { key: 'k1', value: 'v1-1' },
          { key: 'k1', value: 'v1-2' },
          { key: 'k3', value: 'v3' },
        ],
        expected: [
          ['k2', 'v2'],
          ['k1', 'v1-2'],
          ['k3', 'v3'],
        ],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = ImmutableMap.fromPairArray(example.input).entryTuples();
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('fromArrayWithKeyField()', () => {
    interface ExampleItem {
      readonly keyA: string;
      readonly keyB: string;
      readonly value: string;
    }

    function createExampleItem(
      index: number,
      secondaryValueIndex?: number
    ): ExampleItem {
      const secondaryValueIndexString = secondaryValueIndex
        ? `-${secondaryValueIndex}`
        : '';
      return {
        keyA: `keyA${index}`,
        keyB: `keyB${index}`,
        value: `value${index}${secondaryValueIndexString}`,
      };
    }

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
        expected: [['keyA1', createExampleItem(1)]],
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
        expected: [
          ['keyA1', createExampleItem(1)],
          ['keyA2', createExampleItem(2)],
          ['keyA3', createExampleItem(3)],
        ],
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
        expected: [
          ['keyB1', createExampleItem(1)],
          ['keyB2', createExampleItem(2)],
          ['keyB3', createExampleItem(3)],
        ],
      },
      {
        input: {
          array: [
            createExampleItem(1),
            createExampleItem(2, 1),
            createExampleItem(2, 2),
            createExampleItem(3),
          ],
          keyField: 'keyA',
        },
        expected: [
          ['keyA1', createExampleItem(1)],
          ['keyA2', createExampleItem(2, 2)],
          ['keyA3', createExampleItem(3)],
        ],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = ImmutableMap.fromArrayWithKeyField(
          example.input.array,
          example.input.keyField
        ).entryTuples();
        expect(actual).toEqual(example.expected);
      });
    });
  });

  // entryTuples() is used to extract values from map other tests, so it is not tested here separately
  describe('keys(), values(), entryPairs()', () => {
    interface Example {
      readonly input: readonly [string, string][];
      readonly expected: {
        readonly keys: readonly string[];
        readonly values: readonly string[];
        readonly entryPairs: readonly ImmutableMapKeyValuePair<
          string,
          string
        >[];
      };
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: {
          keys: [],
          values: [],
          entryPairs: [],
        },
      },
      {
        input: [['k1', 'v1']],
        expected: {
          keys: ['k1'],
          values: ['v1'],
          entryPairs: [{ key: 'k1', value: 'v1' }],
        },
      },
      {
        input: [
          ['k1', 'v1'],
          ['k2', 'v2'],
        ],
        expected: {
          keys: ['k1', 'k2'],
          values: ['v1', 'v2'],
          entryPairs: [
            { key: 'k1', value: 'v1' },
            { key: 'k2', value: 'v2' },
          ],
        },
      },
      {
        input: [
          ['k2', 'v2'],
          ['k1', 'v1'],
          ['k3', 'v3'],
        ],
        expected: {
          keys: ['k2', 'k1', 'k3'],
          values: ['v2', 'v1', 'v3'],
          entryPairs: [
            { key: 'k2', value: 'v2' },
            { key: 'k1', value: 'v1' },
            { key: 'k3', value: 'v3' },
          ],
        },
      },
      {
        input: [
          ['k2', 'v2'],
          ['k1', 'v1-1'],
          ['k1', 'v1-2'],
          ['k3', 'v3'],
        ],
        expected: {
          keys: ['k2', 'k1', 'k3'],
          values: ['v2', 'v1-2', 'v3'],
          entryPairs: [
            { key: 'k2', value: 'v2' },
            { key: 'k1', value: 'v1-2' },
            { key: 'k3', value: 'v3' },
          ],
        },
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const map = ImmutableMap.fromTupleArray(example.input);
        expect(map.keys()).toEqual(example.expected.keys);
        expect(map.values()).toEqual(example.expected.values);
        expect(map.entryPairs()).toEqual(example.expected.entryPairs);
      });
    });
  });

  describe('has()', () => {
    interface Example {
      readonly input: {
        readonly initialValues: readonly [string, string][];
        readonly key: string;
      };
      readonly expected: boolean;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          initialValues: [],
          key: 'k1',
        },
        expected: false,
      },
      {
        input: {
          initialValues: [['k1', 'v1']],
          key: 'k1',
        },
        expected: true,
      },
      {
        input: {
          initialValues: [['k1', 'v1']],
          key: 'k2',
        },
        expected: false,
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k1',
        },
        expected: true,
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k2',
        },
        expected: true,
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k3',
        },
        expected: true,
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k0',
        },
        expected: false,
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k4',
        },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const map = ImmutableMap.fromTupleArray(example.input.initialValues);
        expect(map.has(example.input.key)).toEqual(example.expected);
      });
    });
  });

  describe('get()', () => {
    interface Example {
      readonly input: {
        readonly initialValues: readonly [string, string][];
        readonly key: string;
      };
      readonly expected: string | undefined;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          initialValues: [],
          key: 'k1',
        },
        expected: undefined,
      },
      {
        input: {
          initialValues: [['k1', 'v1']],
          key: 'k1',
        },
        expected: 'v1',
      },
      {
        input: {
          initialValues: [['k1', 'v1']],
          key: 'k2',
        },
        expected: undefined,
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k1',
        },
        expected: 'v1',
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k2',
        },
        expected: 'v2',
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k3',
        },
        expected: 'v3',
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k0',
        },
        expected: undefined,
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k4',
        },
        expected: undefined,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const map = ImmutableMap.fromTupleArray(example.input.initialValues);
        expect(map.get(example.input.key)).toEqual(example.expected);
      });
    });
  });

  describe('getWithFallbackValue()', () => {
    const FALLBACK_VALUE = 'FALLBACK_VALUE';

    interface Example {
      readonly input: {
        readonly initialValues: readonly [string, string][];
        readonly key: string;
      };
      readonly expected: string;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          initialValues: [],
          key: 'k1',
        },
        expected: FALLBACK_VALUE,
      },
      {
        input: {
          initialValues: [['k1', 'v1']],
          key: 'k1',
        },
        expected: 'v1',
      },
      {
        input: {
          initialValues: [['k1', 'v1']],
          key: 'k2',
        },
        expected: FALLBACK_VALUE,
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k1',
        },
        expected: 'v1',
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k2',
        },
        expected: 'v2',
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k3',
        },
        expected: 'v3',
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k0',
        },
        expected: FALLBACK_VALUE,
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k4',
        },
        expected: FALLBACK_VALUE,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const map = ImmutableMap.fromTupleArray(example.input.initialValues);
        expect(
          map.getWithFallbackValue(example.input.key, FALLBACK_VALUE)
        ).toEqual(example.expected);
      });
    });
  });

  describe('getOrThrow()', () => {
    describe('valid', () => {
      interface Example {
        readonly input: {
          readonly initialValues: readonly [string, string][];
          readonly key: string;
        };
        readonly expected: string;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            initialValues: [['k1', 'v1']],
            key: 'k1',
          },
          expected: 'v1',
        },
        {
          input: {
            initialValues: [
              ['k1', 'v1'],
              ['k2', 'v2'],
              ['k3', 'v3'],
            ],
            key: 'k1',
          },
          expected: 'v1',
        },
        {
          input: {
            initialValues: [
              ['k1', 'v1'],
              ['k2', 'v2'],
              ['k3', 'v3'],
            ],
            key: 'k2',
          },
          expected: 'v2',
        },
        {
          input: {
            initialValues: [
              ['k1', 'v1'],
              ['k2', 'v2'],
              ['k3', 'v3'],
            ],
            key: 'k3',
          },
          expected: 'v3',
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const map = ImmutableMap.fromTupleArray(example.input.initialValues);
          expect(map.getOrThrow(example.input.key)).toEqual(example.expected);
        });
      });
    });

    describe('throws', () => {
      interface Example {
        readonly input: {
          readonly initialValues: readonly [string, string][];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          readonly key: any;
        };
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            initialValues: [],
            key: 'k1',
          },
        },
        {
          input: {
            initialValues: [['k1', 'v1']],
            key: 'k2',
          },
        },
        {
          input: {
            initialValues: [
              ['k1', 'v1'],
              ['k2', 'v2'],
              ['k3', 'v3'],
            ],
            key: 'k0',
          },
        },
        {
          input: {
            initialValues: [
              ['k1', 'v1'],
              ['k2', 'v2'],
              ['k3', 'v3'],
            ],
            key: 'k4',
          },
        },
        {
          input: {
            initialValues: [
              ['k1', 'v1'],
              ['k2', 'v2'],
              ['k3', 'v3'],
            ],
            key: 1,
          },
        },
        {
          input: {
            initialValues: [['1', 'v1']],
            key: 1,
          },
        },
        {
          input: {
            initialValues: [['k1', 'v1']],
            key: {},
          },
        },
        {
          input: {
            initialValues: [['k1', 'v1']],
            key: [],
          },
        },
        {
          input: {
            initialValues: [['k1', 'v1']],
            key: undefined,
          },
        },
        {
          input: {
            initialValues: [['k1', 'v1']],
            key: null,
          },
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const map = ImmutableMap.fromTupleArray(example.input.initialValues);
          expect(() => map.getOrThrow(example.input.key)).toThrowError();
        });
      });
    });
  });

  describe('set()', () => {
    interface Example {
      readonly input: {
        readonly initialValues: readonly [string, string][];
        readonly key: string;
        readonly value: string;
      };
      readonly expected: {
        readonly original: readonly [string, string][];
        readonly updated: readonly [string, string][];
      };
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          initialValues: [],
          key: 'k1',
          value: 'v1',
        },
        expected: {
          original: [],
          updated: [['k1', 'v1']],
        },
      },
      {
        input: {
          initialValues: [['k1', 'v1']],
          key: 'k1',
          value: 'v1',
        },
        expected: {
          original: [['k1', 'v1']],
          updated: [['k1', 'v1']],
        },
      },
      {
        input: {
          initialValues: [['k1', 'v1']],
          key: 'k1',
          value: 'v1-new',
        },
        expected: {
          original: [['k1', 'v1']],
          updated: [['k1', 'v1-new']],
        },
      },
      {
        input: {
          initialValues: [['k1', 'v1']],
          key: 'k2',
          value: 'v2',
        },
        expected: {
          original: [['k1', 'v1']],
          updated: [
            ['k1', 'v1'],
            ['k2', 'v2'],
          ],
        },
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
          ],
          key: 'k1',
          value: 'v1',
        },
        expected: {
          original: [
            ['k1', 'v1'],
            ['k2', 'v2'],
          ],
          updated: [
            ['k1', 'v1'],
            ['k2', 'v2'],
          ],
        },
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
          ],
          key: 'k1',
          value: 'v1-new',
        },
        expected: {
          original: [
            ['k1', 'v1'],
            ['k2', 'v2'],
          ],
          updated: [
            ['k1', 'v1-new'],
            ['k2', 'v2'],
          ],
        },
      },
      {
        input: {
          initialValues: [
            ['k4', 'v4'],
            ['k2', 'v2'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k1',
          value: 'v1',
        },
        expected: {
          original: [
            ['k4', 'v4'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          updated: [
            ['k4', 'v4'],
            ['k2', 'v2'],
            ['k3', 'v3'],
            ['k1', 'v1'],
          ],
        },
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const originalSet = ImmutableMap.fromTupleArray(
          example.input.initialValues
        );
        const updatedSet = originalSet.set(
          example.input.key,
          example.input.value
        );
        expect(originalSet.entryTuples()).toEqual(example.expected.original);
        expect(updatedSet.entryTuples()).toEqual(example.expected.updated);
      });
    });
  });

  describe('remove()', () => {
    interface Example {
      readonly input: {
        readonly initialValues: readonly [string, string][];
        readonly key: string;
      };
      readonly expected: {
        readonly original: readonly [string, string][];
        readonly updated: readonly [string, string][];
      };
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          initialValues: [],
          key: 'k1',
        },
        expected: {
          original: [],
          updated: [],
        },
      },
      {
        input: {
          initialValues: [['k1', 'v1']],
          key: 'k1',
        },
        expected: {
          original: [['k1', 'v1']],
          updated: [],
        },
      },
      {
        input: {
          initialValues: [['k1', 'v1']],
          key: 'k2',
        },
        expected: {
          original: [['k1', 'v1']],
          updated: [['k1', 'v1']],
        },
      },
      {
        input: {
          initialValues: [
            ['k1', 'v1'],
            ['k2', 'v2'],
          ],
          key: 'k1',
        },
        expected: {
          original: [
            ['k1', 'v1'],
            ['k2', 'v2'],
          ],
          updated: [['k2', 'v2']],
        },
      },
      {
        input: {
          initialValues: [
            ['k4', 'v4'],
            ['k2', 'v2'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          key: 'k2',
        },
        expected: {
          original: [
            ['k4', 'v4'],
            ['k2', 'v2'],
            ['k3', 'v3'],
          ],
          updated: [
            ['k4', 'v4'],
            ['k3', 'v3'],
          ],
        },
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const originalSet = ImmutableMap.fromTupleArray(
          example.input.initialValues
        );
        const updatedSet = originalSet.remove(example.input.key);
        expect(originalSet.entryTuples()).toEqual(example.expected.original);
        expect(updatedSet.entryTuples()).toEqual(example.expected.updated);
      });
    });
  });

  describe('clear()', () => {
    interface Example {
      readonly input: readonly [string, string][];
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
      },
      {
        input: [['k1', 'v1']],
      },
      {
        input: [
          ['k1', 'v1'],
          ['k2', 'v2'],
        ],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual: readonly [string, string][] = ImmutableMap.fromTupleArray(
          example.input
        )
          .clear()
          .entryTuples();
        expect(actual).toEqual([]);
      });
    });
  });
});
