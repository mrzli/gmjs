import { getEnumValues } from './enum-utils';

describe('enum-utils', () => {
  describe('getEnumValues()', () => {
    it('example 1', () => {
      enum ExampleEnumString1 {
        VALUE1 = 'VALUE1',
        VALUE2 = 'VALUE2',
      }

      const actual: readonly ExampleEnumString1[] =
        getEnumValues(ExampleEnumString1);
      expect(actual).toEqual([
        ExampleEnumString1.VALUE1,
        ExampleEnumString1.VALUE2,
      ]);
    });

    it('example 2', () => {
      enum ExampleEnumString2 {
        VALUE1 = 'VALUE1_different',
        VALUE2 = 'VALUE2_different',
      }

      const actual = getEnumValues(ExampleEnumString2);
      expect(actual).toEqual([
        ExampleEnumString2.VALUE1,
        ExampleEnumString2.VALUE2,
      ]);
    });
  });
});
