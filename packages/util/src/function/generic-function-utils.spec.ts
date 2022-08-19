import {
  alwaysFalsePredicate,
  alwaysTruePredicate,
  identityFn,
} from './generic-function-utils';

describe('generic-function-utils', () => {
  const EXAMPLE_ARRAY: readonly number[] = [1, 2, 3, 4, 5];

  it('alwaysTruePredicate()', () => {
    expect(EXAMPLE_ARRAY.filter(alwaysTruePredicate)).toHaveLength(
      EXAMPLE_ARRAY.length
    );
  });

  it('alwaysFalsePredicate()', () => {
    expect(EXAMPLE_ARRAY.filter(alwaysFalsePredicate)).toHaveLength(0);
  });

  describe('identityFn()', () => {
    interface Example {
      readonly input: number | string;
      readonly expected: number | string;
    }

    const EXAMPLES: readonly Example[] = [
      { input: 1, expected: 1 },
      { input: 2, expected: 2 },
      { input: 'str', expected: 'str' },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        expect(identityFn(example.input)).toEqual(example.expected);
      });
    });
  });
});
