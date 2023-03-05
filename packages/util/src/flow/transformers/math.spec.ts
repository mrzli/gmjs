import { Fn1 } from '../../types';
import { applyFn, transformPipe } from '../function-pipe';
import {
  sum,
  cumSum,
  sumBy,
  cumSumBy,
  mean,
  meanBy,
  min,
  minBy,
  cumMin,
  cumMinBy,
  max,
  maxBy,
  cumMax,
  cumMaxBy,
} from './math';
import { getArrayResult } from './test-util';

describe('math', () => {
  interface MathExampleItem {
    readonly value: number;
  }

  type MathItemType = number | MathExampleItem;

  interface MathExampleBase<T extends MathItemType> {
    readonly input: readonly T[];
  }

  interface MathExampleSimple<T extends MathItemType>
    extends MathExampleBase<T> {
    readonly expected: number;
  }

  interface MathExampleCum<T extends MathItemType> extends MathExampleBase<T> {
    readonly expected: readonly number[];
  }

  const VALUE_SELECTOR = (item: MathExampleItem) => item.value;

  function toObjectExamplesSimple(
    examples: readonly MathExampleSimple<number>[]
  ): readonly MathExampleSimple<MathExampleItem>[] {
    return examples.map((example) => ({
      input: example.input.map((item) => ({ value: item })),
      expected: example.expected,
    }));
  }

  function toObjectExamplesCum(
    examples: readonly MathExampleCum<number>[]
  ): readonly MathExampleCum<MathExampleItem>[] {
    return examples.map((example) => ({
      input: example.input.map((item) => ({ value: item })),
      expected: example.expected,
    }));
  }

  function testSimpleExamples<T extends MathItemType>(
    examples: readonly MathExampleSimple<T>[],
    transformer: Fn1<Iterable<T>, number>
  ): void {
    examples.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = applyFn(example.input, transformPipe(transformer));
        expect(actual).toEqual(example.expected);
      });
    });
  }

  function testCumExamples<T extends MathItemType>(
    examples: readonly MathExampleCum<T>[],
    transformer: Fn1<Iterable<T>, Iterable<number>>
  ): void {
    examples.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = getArrayResult(example.input, transformer);
        expect(actual).toEqual(example.expected);
      });
    });
  }

  describe('sum()', () => {
    const EXAMPLES: readonly MathExampleSimple<number>[] = [
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

    testSimpleExamples(EXAMPLES, sum());
    testSimpleExamples(toObjectExamplesSimple(EXAMPLES), sumBy(VALUE_SELECTOR));
  });

  describe('cumSum()', () => {
    const EXAMPLES: readonly MathExampleCum<number>[] = [
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

    testCumExamples(EXAMPLES, cumSum());
    testCumExamples(toObjectExamplesCum(EXAMPLES), cumSumBy(VALUE_SELECTOR));
  });

  describe('min()', () => {
    const EXAMPLES: readonly MathExampleSimple<number>[] = [
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
        expected: 1,
      },
      {
        input: [3, 2, 1],
        expected: 1,
      },
      {
        input: [2, 1, 4, 3],
        expected: 1,
      },
    ];

    testSimpleExamples(EXAMPLES, min());
    testSimpleExamples(toObjectExamplesSimple(EXAMPLES), minBy(VALUE_SELECTOR));
  });

  describe('cumMin()', () => {
    const EXAMPLES: readonly MathExampleCum<number>[] = [
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
        expected: [1, 1, 1],
      },
      {
        input: [3, 2, 1],
        expected: [3, 2, 1],
      },
      {
        input: [2, 1, 4, 3],
        expected: [2, 1, 1, 1],
      },
    ];

    testCumExamples(EXAMPLES, cumMin());
    testCumExamples(toObjectExamplesCum(EXAMPLES), cumMinBy(VALUE_SELECTOR));
  });

  describe('max()', () => {
    const EXAMPLES: readonly MathExampleSimple<number>[] = [
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
        expected: 3,
      },
      {
        input: [3, 2, 1],
        expected: 3,
      },
      {
        input: [2, 1, 4, 3],
        expected: 4,
      },
    ];

    testSimpleExamples(EXAMPLES, max());
    testSimpleExamples(toObjectExamplesSimple(EXAMPLES), maxBy(VALUE_SELECTOR));
  });

  describe('cumMax()', () => {
    const EXAMPLES: readonly MathExampleCum<number>[] = [
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
        expected: [1, 2, 3],
      },
      {
        input: [3, 2, 1],
        expected: [3, 3, 3],
      },
      {
        input: [2, 1, 4, 3],
        expected: [2, 2, 4, 4],
      },
    ];

    testCumExamples(EXAMPLES, cumMax());
    testCumExamples(toObjectExamplesCum(EXAMPLES), cumMaxBy(VALUE_SELECTOR));
  });

  describe('mean()', () => {
    const EXAMPLES: readonly MathExampleSimple<number>[] = [
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

    testSimpleExamples(EXAMPLES, mean());
    testSimpleExamples(
      toObjectExamplesSimple(EXAMPLES),
      meanBy(VALUE_SELECTOR)
    );
  });
});
