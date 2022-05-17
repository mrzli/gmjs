import {
  isArray,
  isBoolean,
  isDate,
  isNumber,
  isObject,
  isString,
} from './type-checks';

describe('type-checks', () => {
  describe('isBoolean()', () => {
    interface Example {
      readonly input: unknown;
      readonly expected: boolean;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: undefined,
        expected: false,
      },
      {
        input: null,
        expected: false,
      },
      {
        input: 0,
        expected: false,
      },
      {
        input: 1,
        expected: false,
      },
      {
        input: -1,
        expected: false,
      },
      {
        input: 5.5,
        expected: false,
      },
      {
        input: 1_000_000,
        expected: false,
      },
      {
        input: 1e12,
        expected: false,
      },
      {
        input: Number('6.7'),
        expected: false,
      },
      {
        input: NaN,
        expected: false,
      },
      {
        input: Infinity,
        expected: false,
      },
      {
        input: '',
        expected: false,
      },
      {
        input: 'some string',
        expected: false,
      },
      {
        input: String(11),
        expected: false,
      },
      {
        input: false,
        expected: true,
      },
      {
        input: true,
        expected: true,
      },
      {
        input: Boolean('true'),
        expected: true,
      },
      {
        input: new Date(),
        expected: false,
      },
      {
        input: [],
        expected: false,
      },
      {
        input: [1, 2, 3],
        expected: false,
      },
      {
        input: {},
        expected: false,
      },
      {
        input: { field: 'value' },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = isBoolean(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('isNumber()', () => {
    interface Example {
      readonly input: unknown;
      readonly expected: boolean;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: undefined,
        expected: false,
      },
      {
        input: null,
        expected: false,
      },
      {
        input: 0,
        expected: true,
      },
      {
        input: 1,
        expected: true,
      },
      {
        input: -1,
        expected: true,
      },
      {
        input: 5.5,
        expected: true,
      },
      {
        input: 1_000_000,
        expected: true,
      },
      {
        input: 1e12,
        expected: true,
      },
      {
        input: Number('6.7'),
        expected: true,
      },
      {
        input: NaN,
        expected: false,
      },
      {
        input: Infinity,
        expected: false,
      },
      {
        input: '',
        expected: false,
      },
      {
        input: 'some string',
        expected: false,
      },
      {
        input: String(11),
        expected: false,
      },
      {
        input: false,
        expected: false,
      },
      {
        input: true,
        expected: false,
      },
      {
        input: Boolean('true'),
        expected: false,
      },
      {
        input: new Date(),
        expected: false,
      },
      {
        input: [],
        expected: false,
      },
      {
        input: [1, 2, 3],
        expected: false,
      },
      {
        input: {},
        expected: false,
      },
      {
        input: { field: 'value' },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = isNumber(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('isString()', () => {
    interface Example {
      readonly input: unknown;
      readonly expected: boolean;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: undefined,
        expected: false,
      },
      {
        input: null,
        expected: false,
      },
      {
        input: 0,
        expected: false,
      },
      {
        input: 1,
        expected: false,
      },
      {
        input: -1,
        expected: false,
      },
      {
        input: 5.5,
        expected: false,
      },
      {
        input: 1_000_000,
        expected: false,
      },
      {
        input: 1e12,
        expected: false,
      },
      {
        input: Number('6.7'),
        expected: false,
      },
      {
        input: NaN,
        expected: false,
      },
      {
        input: Infinity,
        expected: false,
      },
      {
        input: '',
        expected: true,
      },
      {
        input: 'some string',
        expected: true,
      },
      {
        input: String(11),
        expected: true,
      },
      {
        input: false,
        expected: false,
      },
      {
        input: true,
        expected: false,
      },
      {
        input: Boolean('true'),
        expected: false,
      },
      {
        input: new Date(),
        expected: false,
      },
      {
        input: [],
        expected: false,
      },
      {
        input: [1, 2, 3],
        expected: false,
      },
      {
        input: {},
        expected: false,
      },
      {
        input: { field: 'value' },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = isString(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('isDate()', () => {
    interface Example {
      readonly input: unknown;
      readonly expected: boolean;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: undefined,
        expected: false,
      },
      {
        input: null,
        expected: false,
      },
      {
        input: 0,
        expected: false,
      },
      {
        input: 1,
        expected: false,
      },
      {
        input: -1,
        expected: false,
      },
      {
        input: 5.5,
        expected: false,
      },
      {
        input: 1_000_000,
        expected: false,
      },
      {
        input: 1e12,
        expected: false,
      },
      {
        input: Number('6.7'),
        expected: false,
      },
      {
        input: NaN,
        expected: false,
      },
      {
        input: Infinity,
        expected: false,
      },
      {
        input: '',
        expected: false,
      },
      {
        input: 'some string',
        expected: false,
      },
      {
        input: String(11),
        expected: false,
      },
      {
        input: false,
        expected: false,
      },
      {
        input: true,
        expected: false,
      },
      {
        input: Boolean('true'),
        expected: false,
      },
      {
        input: new Date(),
        expected: true,
      },
      {
        input: [],
        expected: false,
      },
      {
        input: [1, 2, 3],
        expected: false,
      },
      {
        input: {},
        expected: false,
      },
      {
        input: { field: 'value' },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = isDate(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('isArray()', () => {
    interface Example {
      readonly input: unknown;
      readonly expected: boolean;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: undefined,
        expected: false,
      },
      {
        input: null,
        expected: false,
      },
      {
        input: 0,
        expected: false,
      },
      {
        input: 1,
        expected: false,
      },
      {
        input: -1,
        expected: false,
      },
      {
        input: 5.5,
        expected: false,
      },
      {
        input: 1_000_000,
        expected: false,
      },
      {
        input: 1e12,
        expected: false,
      },
      {
        input: Number('6.7'),
        expected: false,
      },
      {
        input: NaN,
        expected: false,
      },
      {
        input: Infinity,
        expected: false,
      },
      {
        input: '',
        expected: false,
      },
      {
        input: 'some string',
        expected: false,
      },
      {
        input: String(11),
        expected: false,
      },
      {
        input: false,
        expected: false,
      },
      {
        input: true,
        expected: false,
      },
      {
        input: Boolean('true'),
        expected: false,
      },
      {
        input: new Date(),
        expected: false,
      },
      {
        input: [],
        expected: true,
      },
      {
        input: [1, 2, 3],
        expected: true,
      },
      {
        input: {},
        expected: false,
      },
      {
        input: { field: 'value' },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = isArray(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('isObject()', () => {
    interface Example {
      readonly input: unknown;
      readonly expected: boolean;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: undefined,
        expected: false,
      },
      {
        input: null,
        expected: false,
      },
      {
        input: 0,
        expected: false,
      },
      {
        input: 1,
        expected: false,
      },
      {
        input: -1,
        expected: false,
      },
      {
        input: 5.5,
        expected: false,
      },
      {
        input: 1_000_000,
        expected: false,
      },
      {
        input: 1e12,
        expected: false,
      },
      {
        input: Number('6.7'),
        expected: false,
      },
      {
        input: NaN,
        expected: false,
      },
      {
        input: Infinity,
        expected: false,
      },
      {
        input: '',
        expected: false,
      },
      {
        input: 'some string',
        expected: false,
      },
      {
        input: String(11),
        expected: false,
      },
      {
        input: false,
        expected: false,
      },
      {
        input: true,
        expected: false,
      },
      {
        input: Boolean('true'),
        expected: false,
      },
      {
        input: new Date(),
        expected: false,
      },
      {
        input: [],
        expected: false,
      },
      {
        input: [1, 2, 3],
        expected: false,
      },
      {
        input: {},
        expected: true,
      },
      {
        input: { field: 'value' },
        expected: true,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = isObject(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
