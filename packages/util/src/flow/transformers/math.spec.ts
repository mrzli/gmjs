import { applyFn, transformPipe } from '../function-pipe';
import { sum, cumSum, sumBy, cumSumBy, mean, meanBy } from './math';
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

  describe('sumBy()', () => {
    interface ExampleItem {
      readonly value: number;
    }

    interface Example {
      readonly input: readonly ExampleItem[];
      readonly expected: number;
    }

    const VALUE_SELECTOR = (item: ExampleItem) => item.value;

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: 0,
      },
      {
        input: [{ value: 0 }],
        expected: 0,
      },
      {
        input: [{ value: 1 }],
        expected: 1,
      },
      {
        input: [{ value: 1 }, { value: 2 }, { value: 3 }],
        expected: 6,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = applyFn(
          example.input,
          transformPipe(sumBy(VALUE_SELECTOR))
        );
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

  describe('cumSumBy()', () => {
    interface ExampleItem {
      readonly value: number;
    }

    interface Example {
      readonly input: readonly ExampleItem[];
      readonly expected: readonly number[];
    }

    const VALUE_SELECTOR = (item: ExampleItem) => item.value;

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [{ value: 0 }],
        expected: [0],
      },
      {
        input: [{ value: 1 }],
        expected: [1],
      },
      {
        input: [{ value: 1 }, { value: 2 }, { value: 3 }],
        expected: [1, 3, 6],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, cumSumBy(VALUE_SELECTOR));
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('mean()', () => {
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
        input: [1, 2, 6],
        expected: 3,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = applyFn(example.input, transformPipe(mean()));
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('meanBy()', () => {
    interface ExampleItem {
      readonly value: number;
    }

    interface Example {
      readonly input: readonly ExampleItem[];
      readonly expected: number;
    }

    const VALUE_SELECTOR = (item: ExampleItem) => item.value;

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: 0,
      },
      {
        input: [{ value: 0 }],
        expected: 0,
      },
      {
        input: [{ value: 1 }],
        expected: 1,
      },
      {
        input: [{ value: 1 }, { value: 2 }, { value: 6 }],
        expected: 3,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = applyFn(
          example.input,
          transformPipe(meanBy(VALUE_SELECTOR))
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
