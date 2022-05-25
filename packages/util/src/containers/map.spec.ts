import { mapGetOrThrow } from './map';
import { AnyValue } from '../types/generic';

describe('map', () => {
  describe('mapGetOrThrow()', () => {
    const MAP = new Map<string, string | undefined>([
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', undefined],
    ]);

    describe('valid', () => {
      interface Example {
        readonly input: string;
        readonly expected: string | undefined;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: 'key1',
          expected: 'value1',
        },
        {
          input: 'key2',
          expected: 'value2',
        },
        {
          input: 'key3',
          expected: undefined,
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          const actual = mapGetOrThrow(MAP, example.input);
          expect(actual).toEqual(example.expected);
        });
      });
    });

    describe('throws', () => {
      interface Example {
        readonly input: AnyValue;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: undefined,
        },
        {
          input: null,
        },
        {
          input: '',
        },
        {
          input: 'non-existing-key',
        },
      ];

      EXAMPLES.forEach((example) => {
        it(JSON.stringify(example), () => {
          expect(() => mapGetOrThrow(MAP, example.input)).toThrowError();
        });
      });
    });
  });
});
