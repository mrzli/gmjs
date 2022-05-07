import { Nullish } from '../types/generic';
import { isNotNullish, isNullish } from './generic';

describe('generic', () => {
  describe('isNullish()', () => {
    interface Example {
      readonly input: Nullish<number>;
      readonly expected: boolean;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: undefined,
        expected: true,
      },
      {
        input: null,
        expected: true,
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
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = isNullish(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('isNotNullish()', () => {
    interface Example {
      readonly input: Nullish<number>;
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
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = isNotNullish(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
