import { applyFn, transformPipe } from '../function-pipe';
import { conditionalConvert, tap } from './single';

describe('single', () => {
  describe('tap()', () => {
    interface Example {
      readonly input: number;
      readonly expected: {
        readonly sideEffectVar: string;
        readonly output: number;
      };
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: 0,
        expected: {
          sideEffectVar: 'value0',
          output: 0,
        },
      },
      {
        input: 1,
        expected: {
          sideEffectVar: 'value1',
          output: 1,
        },
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        let sideEffectVar = 'value';
        const actual = applyFn(
          example.input,
          transformPipe(
            tap((input) => {
              sideEffectVar += input;
            })
          )
        );
        expect(actual).toEqual(example.expected.output);
        expect(sideEffectVar).toEqual(example.expected.sideEffectVar);
      });
    });
  });

  describe('conditionalConvert()', () => {
    interface Example {
      readonly input: {
        readonly input: string;
        readonly condition: ((input: string) => boolean) | boolean;
      };
      readonly expected: string;
    }

    const CONVERT_FN = (s: string): string => s + 'x';

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          input: 'a',
          condition: false,
        },
        expected: 'a',
      },
      {
        input: {
          input: 'a',
          condition: () => false,
        },
        expected: 'a',
      },
      {
        input: {
          input: 'a',
          condition: true,
        },
        expected: 'ax',
      },
      {
        input: {
          input: 'a',
          condition: () => true,
        },
        expected: 'ax',
      },
      {
        input: {
          input: 'a',
          condition: (input: string) => input === 'a',
        },
        expected: 'ax',
      },
      {
        input: {
          input: 'b',
          condition: (input: string) => input === 'a',
        },
        expected: 'b',
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = applyFn(
          example.input.input,
          conditionalConvert(example.input.condition, CONVERT_FN)
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
