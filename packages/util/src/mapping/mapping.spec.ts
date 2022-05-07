import { transformIfExists } from './mapping';
import { Nullish } from '../types/generic';

describe('mapping', () => {
  describe('transformIfExists()', () => {
    const TRANSFORMER = (value: number): number => value * 2;
    const DEFAULT_VALUE = undefined;

    interface Example {
      readonly input: Nullish<number>;
      readonly expected: Nullish<number>;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: undefined,
        expected: undefined,
      },
      {
        input: null,
        expected: undefined,
      },
      {
        input: 0,
        expected: 0,
      },
      {
        input: 1,
        expected: 2,
      },
      {
        input: -1,
        expected: -2,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = transformIfExists(
          example.input,
          TRANSFORMER,
          DEFAULT_VALUE
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
