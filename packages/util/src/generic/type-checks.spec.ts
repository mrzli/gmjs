import {
  isArray,
  isBoolean,
  isDate,
  isNumber,
  isObject,
  isString,
} from './type-checks';

describe('type-checks', () => {
  interface Example {
    readonly description: string;
    readonly input: unknown;
    readonly expected: boolean;
  }

  describe('isBoolean()', () => {
    const EXAMPLES: readonly Example[] = [
      { description: 'undefined', input: undefined, expected: false },
      { description: 'null', input: null, expected: false },
      { description: '0', input: 0, expected: false },
      { description: '1', input: 1, expected: false },
      { description: '-1', input: -1, expected: false },
      { description: '5.5', input: 5.5, expected: false },
      { description: '1_000_000', input: 1_000_000, expected: false },
      { description: '1e12', input: 1e12, expected: false },
      { description: "Number('6.7')", input: Number('6.7'), expected: false },
      {
        description: 'Number.MIN_VALUE',
        input: Number.MIN_VALUE,
        expected: false,
      },
      {
        description: 'Number.MAX_VALUE',
        input: Number.MAX_VALUE,
        expected: false,
      },
      {
        description: 'Number.MIN_SAFE_INTEGER',
        input: Number.MIN_SAFE_INTEGER,
        expected: false,
      },
      {
        description: 'Number.MAX_SAFE_INTEGER',
        input: Number.MAX_SAFE_INTEGER,
        expected: false,
      },
      {
        description: 'Number.POSITIVE_INFINITY',
        input: Number.POSITIVE_INFINITY,
        expected: false,
      },
      {
        description: 'Number.NEGATIVE_INFINITY',
        input: Number.NEGATIVE_INFINITY,
        expected: false,
      },
      { description: 'NaN', input: NaN, expected: false },
      { description: "''", input: '', expected: false },
      { description: "'some string'", input: 'some string', expected: false },
      { description: 'String(11)', input: String(11), expected: false },
      { description: 'false', input: false, expected: true },
      { description: 'true', input: true, expected: true },
      {
        description: "Boolean('true')",
        input: Boolean('true'),
        expected: true,
      },
      { description: 'new Date()', input: new Date(), expected: false },
      { description: '[]', input: [], expected: false },
      {
        description: '[1, 2, 3]',
        input: [1, 2, 3],
        expected: false,
      },
      { description: '{}', input: {}, expected: false },
      {
        description: "{ field: 'value' }",
        input: { field: 'value' },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(example.description, () => {
        const actual = isBoolean(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('isNumber()', () => {
    const EXAMPLES: readonly Example[] = [
      { description: 'undefined', input: undefined, expected: false },
      { description: 'null', input: null, expected: false },
      { description: '0', input: 0, expected: true },
      { description: '1', input: 1, expected: true },
      { description: '-1', input: -1, expected: true },
      { description: '5.5', input: 5.5, expected: true },
      { description: '1_000_000', input: 1_000_000, expected: true },
      { description: '1e12', input: 1e12, expected: true },
      { description: "Number('6.7')", input: Number('6.7'), expected: true },
      {
        description: 'Number.MIN_VALUE',
        input: Number.MIN_VALUE,
        expected: true,
      },
      {
        description: 'Number.MAX_VALUE',
        input: Number.MAX_VALUE,
        expected: true,
      },
      {
        description: 'Number.MIN_SAFE_INTEGER',
        input: Number.MIN_SAFE_INTEGER,
        expected: true,
      },
      {
        description: 'Number.MAX_SAFE_INTEGER',
        input: Number.MAX_SAFE_INTEGER,
        expected: true,
      },
      {
        description: 'Number.POSITIVE_INFINITY',
        input: Number.POSITIVE_INFINITY,
        expected: false,
      },
      {
        description: 'Number.NEGATIVE_INFINITY',
        input: Number.NEGATIVE_INFINITY,
        expected: false,
      },
      { description: 'NaN', input: NaN, expected: false },
      { description: "''", input: '', expected: false },
      { description: "'some string'", input: 'some string', expected: false },
      { description: 'String(11)', input: String(11), expected: false },
      { description: 'false', input: false, expected: false },
      { description: 'true', input: true, expected: false },
      {
        description: "Boolean('true')",
        input: Boolean('true'),
        expected: false,
      },
      { description: 'new Date()', input: new Date(), expected: false },
      { description: '[]', input: [], expected: false },
      {
        description: '[1, 2, 3]',
        input: [1, 2, 3],
        expected: false,
      },
      { description: '{}', input: {}, expected: false },
      {
        description: "{ field: 'value' }",
        input: { field: 'value' },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(example.description, () => {
        const actual = isNumber(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('isString()', () => {
    const EXAMPLES: readonly Example[] = [
      { description: 'undefined', input: undefined, expected: false },
      { description: 'null', input: null, expected: false },
      { description: '0', input: 0, expected: false },
      { description: '1', input: 1, expected: false },
      { description: '-1', input: -1, expected: false },
      { description: '5.5', input: 5.5, expected: false },
      { description: '1_000_000', input: 1_000_000, expected: false },
      { description: '1e12', input: 1e12, expected: false },
      { description: "Number('6.7')", input: Number('6.7'), expected: false },
      {
        description: 'Number.MIN_VALUE',
        input: Number.MIN_VALUE,
        expected: false,
      },
      {
        description: 'Number.MAX_VALUE',
        input: Number.MAX_VALUE,
        expected: false,
      },
      {
        description: 'Number.MIN_SAFE_INTEGER',
        input: Number.MIN_SAFE_INTEGER,
        expected: false,
      },
      {
        description: 'Number.MAX_SAFE_INTEGER',
        input: Number.MAX_SAFE_INTEGER,
        expected: false,
      },
      {
        description: 'Number.POSITIVE_INFINITY',
        input: Number.POSITIVE_INFINITY,
        expected: false,
      },
      {
        description: 'Number.NEGATIVE_INFINITY',
        input: Number.NEGATIVE_INFINITY,
        expected: false,
      },
      { description: 'NaN', input: NaN, expected: false },
      { description: "''", input: '', expected: true },
      { description: "'some string'", input: 'some string', expected: true },
      { description: 'String(11)', input: String(11), expected: true },
      { description: 'false', input: false, expected: false },
      { description: 'true', input: true, expected: false },
      {
        description: "Boolean('true')",
        input: Boolean('true'),
        expected: false,
      },
      { description: 'new Date()', input: new Date(), expected: false },
      { description: '[]', input: [], expected: false },
      {
        description: '[1, 2, 3]',
        input: [1, 2, 3],
        expected: false,
      },
      { description: '{}', input: {}, expected: false },
      {
        description: "{ field: 'value' }",
        input: { field: 'value' },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(example.description, () => {
        const actual = isString(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('isDate()', () => {
    const EXAMPLES: readonly Example[] = [
      { description: 'undefined', input: undefined, expected: false },
      { description: 'null', input: null, expected: false },
      { description: '0', input: 0, expected: false },
      { description: '1', input: 1, expected: false },
      { description: '-1', input: -1, expected: false },
      { description: '5.5', input: 5.5, expected: false },
      { description: '1_000_000', input: 1_000_000, expected: false },
      { description: '1e12', input: 1e12, expected: false },
      { description: "Number('6.7')", input: Number('6.7'), expected: false },
      {
        description: 'Number.MIN_VALUE',
        input: Number.MIN_VALUE,
        expected: false,
      },
      {
        description: 'Number.MAX_VALUE',
        input: Number.MAX_VALUE,
        expected: false,
      },
      {
        description: 'Number.MIN_SAFE_INTEGER',
        input: Number.MIN_SAFE_INTEGER,
        expected: false,
      },
      {
        description: 'Number.MAX_SAFE_INTEGER',
        input: Number.MAX_SAFE_INTEGER,
        expected: false,
      },
      {
        description: 'Number.POSITIVE_INFINITY',
        input: Number.POSITIVE_INFINITY,
        expected: false,
      },
      {
        description: 'Number.NEGATIVE_INFINITY',
        input: Number.NEGATIVE_INFINITY,
        expected: false,
      },
      { description: 'NaN', input: NaN, expected: false },
      { description: "''", input: '', expected: false },
      { description: "'some string'", input: 'some string', expected: false },
      { description: 'String(11)', input: String(11), expected: false },
      { description: 'false', input: false, expected: false },
      { description: 'true', input: true, expected: false },
      {
        description: "Boolean('true')",
        input: Boolean('true'),
        expected: false,
      },
      { description: 'new Date()', input: new Date(), expected: true },
      { description: '[]', input: [], expected: false },
      {
        description: '[1, 2, 3]',
        input: [1, 2, 3],
        expected: false,
      },
      { description: '{}', input: {}, expected: false },
      {
        description: "{ field: 'value' }",
        input: { field: 'value' },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(example.description, () => {
        const actual = isDate(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('isArray()', () => {
    const EXAMPLES: readonly Example[] = [
      { description: 'undefined', input: undefined, expected: false },
      { description: 'null', input: null, expected: false },
      { description: '0', input: 0, expected: false },
      { description: '1', input: 1, expected: false },
      { description: '-1', input: -1, expected: false },
      { description: '5.5', input: 5.5, expected: false },
      { description: '1_000_000', input: 1_000_000, expected: false },
      { description: '1e12', input: 1e12, expected: false },
      { description: "Number('6.7')", input: Number('6.7'), expected: false },
      {
        description: 'Number.MIN_VALUE',
        input: Number.MIN_VALUE,
        expected: false,
      },
      {
        description: 'Number.MAX_VALUE',
        input: Number.MAX_VALUE,
        expected: false,
      },
      {
        description: 'Number.MIN_SAFE_INTEGER',
        input: Number.MIN_SAFE_INTEGER,
        expected: false,
      },
      {
        description: 'Number.MAX_SAFE_INTEGER',
        input: Number.MAX_SAFE_INTEGER,
        expected: false,
      },
      {
        description: 'Number.POSITIVE_INFINITY',
        input: Number.POSITIVE_INFINITY,
        expected: false,
      },
      {
        description: 'Number.NEGATIVE_INFINITY',
        input: Number.NEGATIVE_INFINITY,
        expected: false,
      },
      { description: 'NaN', input: NaN, expected: false },
      { description: "''", input: '', expected: false },
      { description: "'some string'", input: 'some string', expected: false },
      { description: 'String(11)', input: String(11), expected: false },
      { description: 'false', input: false, expected: false },
      { description: 'true', input: true, expected: false },
      {
        description: "Boolean('true')",
        input: Boolean('true'),
        expected: false,
      },
      { description: 'new Date()', input: new Date(), expected: false },
      { description: '[]', input: [], expected: true },
      {
        description: '[1, 2, 3]',
        input: [1, 2, 3],
        expected: true,
      },
      { description: '{}', input: {}, expected: false },
      {
        description: "{ field: 'value' }",
        input: { field: 'value' },
        expected: false,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(example.description, () => {
        const actual = isArray(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('isObject()', () => {
    const EXAMPLES: readonly Example[] = [
      { description: 'undefined', input: undefined, expected: false },
      { description: 'null', input: null, expected: false },
      { description: '0', input: 0, expected: false },
      { description: '1', input: 1, expected: false },
      { description: '-1', input: -1, expected: false },
      { description: '5.5', input: 5.5, expected: false },
      { description: '1_000_000', input: 1_000_000, expected: false },
      { description: '1e12', input: 1e12, expected: false },
      { description: "Number('6.7')", input: Number('6.7'), expected: false },
      {
        description: 'Number.MIN_VALUE',
        input: Number.MIN_VALUE,
        expected: false,
      },
      {
        description: 'Number.MAX_VALUE',
        input: Number.MAX_VALUE,
        expected: false,
      },
      {
        description: 'Number.MIN_SAFE_INTEGER',
        input: Number.MIN_SAFE_INTEGER,
        expected: false,
      },
      {
        description: 'Number.MAX_SAFE_INTEGER',
        input: Number.MAX_SAFE_INTEGER,
        expected: false,
      },
      {
        description: 'Number.POSITIVE_INFINITY',
        input: Number.POSITIVE_INFINITY,
        expected: false,
      },
      {
        description: 'Number.NEGATIVE_INFINITY',
        input: Number.NEGATIVE_INFINITY,
        expected: false,
      },
      { description: 'NaN', input: NaN, expected: false },
      { description: "''", input: '', expected: false },
      { description: "'some string'", input: 'some string', expected: false },
      { description: 'String(11)', input: String(11), expected: false },
      { description: 'false', input: false, expected: false },
      { description: 'true', input: true, expected: false },
      {
        description: "Boolean('true')",
        input: Boolean('true'),
        expected: false,
      },
      { description: 'new Date()', input: new Date(), expected: false },
      { description: '[]', input: [], expected: false },
      {
        description: '[1, 2, 3]',
        input: [1, 2, 3],
        expected: false,
      },
      { description: '{}', input: {}, expected: true },
      {
        description: "{ field: 'value' }",
        input: { field: 'value' },
        expected: true,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(example.description, () => {
        const actual = isObject(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
