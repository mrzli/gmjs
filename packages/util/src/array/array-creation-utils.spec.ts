import {
  createArrayOfLength,
  fillArrayOfLengthWithValue,
  fillArrayOfLengthWithValueMapper,
} from './array-creation-utils';

describe('array-creation-utils', () => {
  describe('createArrayOfLength()', () => {
    describe('valid', () => {
      interface Example {
        readonly input: number;
        readonly expectedLength: number;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: 0,
          expectedLength: 0,
        },
        {
          input: 1,
          expectedLength: 1,
        },
        {
          input: 10,
          expectedLength: 10,
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(createArrayOfLength(example.input)).toHaveLength(
            example.expectedLength
          );
        });
      });
    });

    describe('throws', () => {
      interface Example {
        readonly input: number;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: -1,
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(() => createArrayOfLength(example.input)).toThrowError();
        });
      });
    });
  });

  describe('fillArrayOfLengthWithValue()', () => {
    describe('valid', () => {
      interface Example {
        readonly input: {
          readonly length: number;
          readonly value: string;
        };
        readonly expected: readonly string[];
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            length: 0,
            value: 'value',
          },
          expected: [],
        },
        {
          input: {
            length: 1,
            value: 'value',
          },
          expected: ['value'],
        },
        {
          input: {
            length: 3,
            value: 'other-value',
          },
          expected: ['other-value', 'other-value', 'other-value'],
        },
        {
          input: {
            length: -1,
            value: 'value',
          },
          expected: [],
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(
            fillArrayOfLengthWithValue(
              example.input.length,
              example.input.value
            )
          ).toEqual(example.expected);
        });
      });
    });

    // describe('throws', () => {
    //   interface Example {
    //     readonly input: number;
    //   }
    //
    //   const EXAMPLES: readonly Example[] = [
    //     {
    //       input: -1,
    //     },
    //   ];
    //
    //   EXAMPLES.forEach((example) => {
    //     it(JSON.stringify(example), () => {
    //       expect(() =>
    //         fillArrayOfLengthWithValue(example.input, '')
    //       ).toThrowError();
    //     });
    //   });
    // });
  });

  describe('fillArrayOfLengthWithValueMapper()', () => {
    describe('valid', () => {
      interface Example {
        readonly input: {
          readonly length: number;
          readonly valueMapper: (index: number) => string;
        };
        readonly expected: readonly string[];
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            length: 0,
            valueMapper: (index) => `value${index + 1}`,
          },
          expected: [],
        },
        {
          input: {
            length: 1,
            valueMapper: (index) => `value${index + 1}`,
          },
          expected: ['value1'],
        },
        {
          input: {
            length: 3,
            valueMapper: (index) => `value${(index + 1) * 2}`,
          },
          expected: ['value2', 'value4', 'value6'],
        },
        {
          input: {
            length: -1,
            valueMapper: (index) => `value${index + 1}`,
          },
          expected: [],
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(
            fillArrayOfLengthWithValueMapper(
              example.input.length,
              example.input.valueMapper
            )
          ).toEqual(example.expected);
        });
      });
    });

    // describe('throws', () => {
    //   interface Example {
    //     readonly input: number;
    //   }
    //
    //   const EXAMPLES: readonly Example[] = [
    //     {
    //       input: -1,
    //     },
    //   ];
    //
    //   EXAMPLES.forEach((example) => {
    //     it(JSON.stringify(example), () => {
    //       expect(() =>
    //         fillArrayOfLengthWithValueMapper(example.input, () => '')
    //       ).toThrowError();
    //     });
    //   });
    // });
  });
});
