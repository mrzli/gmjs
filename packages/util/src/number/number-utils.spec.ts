import {
  clampNumber,
  padNonNegativeIntWithZeroes,
  parseFloatOrThrow,
  parseIntegerOrThrow,
} from './number-utils';

describe('number-utils', () => {
  describe('parseFloatOrThrow()', () => {
    describe('valid', () => {
      interface Example {
        readonly input: string;
        readonly expected: number;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: '0',
          expected: 0,
        },
        {
          input: '1',
          expected: 1,
        },
        {
          input: '5',
          expected: 5,
        },
        {
          input: '55',
          expected: 55,
        },
        {
          input: '-1',
          expected: -1,
        },
        {
          input: '-55',
          expected: -55,
        },
        {
          input: '1.0',
          expected: 1,
        },
        {
          input: '1.01',
          expected: 1.01,
        },
        {
          input: '-1.2',
          expected: -1.2,
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(parseFloatOrThrow(example.input)).toEqual(example.expected);
        });
      });
    });

    describe('throws', () => {
      interface Example {
        readonly input: string;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: '',
        },
        {
          input: ' ',
        },
        {
          input: 'a',
        },
        {
          input: '11a',
        },
        {
          input: '11.',
        },
        {
          input: 'a11',
        },
        {
          input: ' 11',
        },
        {
          input: '+1',
        },
        {
          input: '1.',
        },
        {
          input: '-1.',
        },
        {
          input: '1e5',
        },
        {
          input: '1,2',
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(() => parseFloatOrThrow(example.input)).toThrowError();
        });
      });
    });
  });

  describe('parseIntegerOrThrow()', () => {
    describe('valid', () => {
      interface Example {
        readonly input: string;
        readonly expected: number;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: '0',
          expected: 0,
        },
        {
          input: '1',
          expected: 1,
        },
        {
          input: '5',
          expected: 5,
        },
        {
          input: '55',
          expected: 55,
        },
        {
          input: '-1',
          expected: -1,
        },
        {
          input: '-55',
          expected: -55,
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(parseIntegerOrThrow(example.input)).toEqual(example.expected);
        });
      });
    });

    describe('throws', () => {
      interface Example {
        readonly input: string;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: '',
        },
        {
          input: ' ',
        },
        {
          input: 'a',
        },
        {
          input: '11a',
        },
        {
          input: '11.',
        },
        {
          input: '11.0',
        },
        {
          input: '11.1',
        },
        {
          input: 'a11',
        },
        {
          input: ' 11',
        },
        {
          input: '+1',
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(() => parseIntegerOrThrow(example.input)).toThrowError();
        });
      });
    });
  });

  describe('padNonNegativeIntWithZeroes()', () => {
    describe('valid', () => {
      interface Example {
        readonly input: {
          readonly value: number;
          readonly maxLength: number;
        };
        readonly expected: string;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            value: 1,
            maxLength: 3,
          },
          expected: '001',
        },
        {
          input: {
            value: 1,
            maxLength: 4,
          },
          expected: '0001',
        },
        {
          input: {
            value: 10,
            maxLength: 3,
          },
          expected: '010',
        },
        {
          input: {
            value: 2111,
            maxLength: 3,
          },
          expected: '2111',
        },
        {
          input: {
            value: 0,
            maxLength: 3,
          },
          expected: '000',
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(
            padNonNegativeIntWithZeroes(
              example.input.value,
              example.input.maxLength
            )
          ).toEqual(example.expected);
        });
      });
    });

    describe('throws', () => {
      interface Example {
        readonly input: {
          readonly value: number;
          readonly maxLength: number;
        };
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            value: -1,
            maxLength: 3,
          },
        },
        {
          input: {
            value: 1.2,
            maxLength: 3,
          },
        },
        {
          input: {
            value: 1,
            maxLength: 0,
          },
        },
        {
          input: {
            value: 1,
            maxLength: -1,
          },
        },
        {
          input: {
            value: 1,
            maxLength: 5.2,
          },
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(() =>
            padNonNegativeIntWithZeroes(
              example.input.value,
              example.input.maxLength
            )
          ).toThrowError();
        });
      });
    });
  });

  describe('clampNumber()', () => {
    interface Example {
      readonly input: {
        readonly value: number;
        readonly min: number;
        readonly max: number;
      };
      readonly expected: number;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          value: 0,
          min: 0,
          max: 0,
        },
        expected: 0,
      },
      {
        input: {
          value: 0,
          min: 0,
          max: 10,
        },
        expected: 0,
      },
      {
        input: {
          value: 1,
          min: 0,
          max: 10,
        },
        expected: 1,
      },
      {
        input: {
          value: 10,
          min: 0,
          max: 10,
        },
        expected: 10,
      },
      {
        input: {
          value: 0,
          min: 1,
          max: 10,
        },
        expected: 1,
      },
      {
        input: {
          value: 0,
          min: -1,
          max: 10,
        },
        expected: 0,
      },
      {
        input: {
          value: -2,
          min: -1,
          max: 10,
        },
        expected: -1,
      },
      {
        input: {
          value: 20,
          min: 0,
          max: 10,
        },
        expected: 10,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = clampNumber(
          example.input.value,
          example.input.min,
          example.input.max
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
