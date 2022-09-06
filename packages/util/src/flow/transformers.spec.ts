import { Fn1 } from "../types/function";
import { transformPipe } from "./function-pipe";
import { filter, flatten, map } from './transformers';

describe('transformers', () => {
  describe('map()', () => {
    interface Example {
      readonly input: readonly number[];
      readonly expected: readonly string[];
    }

    const MAPPER: Fn1<number, string> = (item: number) => `${item * 2}x`;
  
    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [1],
        expected: ['2x'],
      },
      {
        input: [1, 2, 3],
        expected: ['2x', '4x', '6x'],
      },
    ];
  
    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = [...transformPipe(map(MAPPER))(example.input)];
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('flatten()', () => {
    interface Example {
      readonly input: readonly (readonly number[])[];
      readonly expected: readonly number[];
    }
  
    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [[]],
        expected: [],
      },
      {
        input: [[], []],
        expected: [],
      },
      {
        input: [[1]],
        expected: [1],
      },
      {
        input: [[1], [2]],
        expected: [1, 2],
      },
      {
        input: [[1, 2]],
        expected: [1, 2],
      },
      {
        input: [[1, 2], [3, 4]],
        expected: [1, 2, 3, 4],
      },
      {
        input: [[1, 2], []],
        expected: [1, 2],
      },
    ];
  
    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = [...transformPipe(flatten())(example.input)];
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('filter()', () => {
    interface Example {
      readonly input: readonly number[];
      readonly expected: readonly number[];
    }

    const PREDICATE: Fn1<number, boolean> = (item: number) => item % 2 === 0;
  
    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: [],
      },
      {
        input: [1],
        expected: [],
      },
      {
        input: [1, 2, 3, 4, 5],
        expected: [2, 4],
      },
    ];
  
    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = [...transformPipe(filter(PREDICATE))(example.input)];
        expect(actual).toEqual(example.expected);
      });
    });
  });
})