import { AnyValue } from '../types/generic';
import { Fn1 } from '../types/function';
import { applyFn, transformPipe, transformPipeMono } from './function-pipe';

describe('function-pipe', () => {
  describe('transformPipe()', () => {
    const MULTIPLY_BY_2 = (input: number): number => input * 2;
    const CONCAT_3 = (input: string): string => input + 3;
    const NUMBER_TO_STRING = (input: number): string => input.toString();
    const STRING_TO_NUMBER = (input: string): number =>
      Number.parseFloat(input);

    interface Example {
      readonly input: {
        readonly value: AnyValue;
        readonly fns: readonly Fn1<AnyValue, AnyValue>[];
      };
      readonly expected: AnyValue;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          value: 1,
          fns: [],
        },
        expected: 1,
      },
      {
        input: {
          value: 1,
          fns: [MULTIPLY_BY_2],
        },
        expected: 2,
      },
      {
        input: {
          value: 1,
          fns: [NUMBER_TO_STRING, CONCAT_3, STRING_TO_NUMBER, MULTIPLY_BY_2],
        },
        expected: 26,
      },
      {
        input: {
          value: '11',
          fns: [CONCAT_3, MULTIPLY_BY_2, NUMBER_TO_STRING],
        },
        expected: '226',
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const actual = transformPipe(...example.input.fns)(example.input.value);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('transformPipeMono()', () => {
    const MULTIPLY_BY_2 = (input: number): number => input * 2;
    const ADD_3 = (input: number): number => input + 3;

    interface Example {
      readonly input: {
        readonly value: number;
        readonly fns: readonly Fn1<number, number>[];
      };
      readonly expected: number;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          value: 1,
          fns: [],
        },
        expected: 1,
      },
      {
        input: {
          value: 1,
          fns: [MULTIPLY_BY_2],
        },
        expected: 2,
      },
      {
        input: {
          value: 11,
          fns: [MULTIPLY_BY_2, ADD_3, MULTIPLY_BY_2],
        },
        expected: 50,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = transformPipeMono(...example.input.fns)(
          example.input.value
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('apply()', () => {
    interface Example {
      readonly input: number;
      readonly expected: number;
    }

    const FN: Fn1<number, number> = (value: number) => value * 2;

    const EXAMPLES: readonly Example[] = [
      {
        input: 1,
        expected: 2,
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = applyFn(example.input, FN);
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
