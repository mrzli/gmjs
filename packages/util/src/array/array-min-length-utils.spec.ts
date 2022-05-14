import {
  ArrayMinLength1,
  ArrayMinLength2,
  ArrayMinLength3,
  ArrayMinLength4,
  ArrayMinLength5,
} from '../types/generic';
import {
  mapMinLength1,
  mapMinLength2,
  mapMinLength3,
  mapMinLength4,
  mapMinLength5,
} from './array-min-length-utils';

describe('array-min-length-utils', () => {
  function mapFn(value: number): string {
    return value.toString() + 'x';
  }

  describe('mapMinLength1()', () => {
    interface Example {
      readonly input: ArrayMinLength1<number>;
      readonly expected: ArrayMinLength1<string>;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [1],
        expected: ['1x'],
      },
      {
        input: [1, 22],
        expected: ['1x', '22x'],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = mapMinLength1(example.input, mapFn);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('mapMinLength2()', () => {
    interface Example {
      readonly input: ArrayMinLength2<number>;
      readonly expected: ArrayMinLength2<string>;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [1, 2],
        expected: ['1x', '2x'],
      },
      {
        input: [1, 2, 22],
        expected: ['1x', '2x', '22x'],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = mapMinLength2(example.input, mapFn);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('mapMinLength3()', () => {
    interface Example {
      readonly input: ArrayMinLength3<number>;
      readonly expected: ArrayMinLength3<string>;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [1, 2, 3],
        expected: ['1x', '2x', '3x'],
      },
      {
        input: [1, 2, 3, 22],
        expected: ['1x', '2x', '3x', '22x'],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = mapMinLength3(example.input, mapFn);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('mapMinLength4()', () => {
    interface Example {
      readonly input: ArrayMinLength4<number>;
      readonly expected: ArrayMinLength4<string>;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [1, 2, 3, 4],
        expected: ['1x', '2x', '3x', '4x'],
      },
      {
        input: [1, 2, 3, 4, 22],
        expected: ['1x', '2x', '3x', '4x', '22x'],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = mapMinLength4(example.input, mapFn);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('mapMinLength5()', () => {
    interface Example {
      readonly input: ArrayMinLength5<number>;
      readonly expected: ArrayMinLength5<string>;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: [1, 2, 3, 4, 5],
        expected: ['1x', '2x', '3x', '4x', '5x'],
      },
      {
        input: [1, 2, 3, 4, 5, 22],
        expected: ['1x', '2x', '3x', '4x', '5x', '22x'],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = mapMinLength5(example.input, mapFn);
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
