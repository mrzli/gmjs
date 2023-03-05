import { applyFn, transformPipe } from '../function-pipe';
import { sum, cumSum } from './math';
import { getArrayResult } from './test-util';

describe('math', () => {
  describe('sum()', () => {
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
        input: [0],
        expected: 0,
      },
      {
        input: [1],
        expected: 1,
      },
      {
        input: [1, 2, 3],
        expected: 6,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = applyFn(example.input, transformPipe(sum()));
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('cumSum()', () => {
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
        input: [1, 2, 3],
        expected: [1, 3, 6],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, cumSum());
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
