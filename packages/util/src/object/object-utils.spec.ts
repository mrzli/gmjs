import {
  objectPickAndConvertFields,
  objectGetKeys,
  objectOmitFields,
  objectPickFields,
  objectRemoveUndefined,
} from './object-utils';
import { ConditionalKeys } from 'type-fest';
import { AnyObject, AnyValue } from '../types/generic';

describe('object-utils', () => {
  interface ObjectType {
    readonly field1: string;
    readonly field2: string;
    readonly field3: number;
  }

  const INPUT_OBJECT: ObjectType = {
    field1: 'value1',
    field2: 'value2',
    field3: 3,
  };

  const COPY_OF_INPUT_OBJECT = { ...INPUT_OBJECT };

  describe('objectGetKeys()', () => {
    it('example', () => {
      const actual: readonly (keyof ObjectType)[] = objectGetKeys(INPUT_OBJECT);
      expect(actual).toEqual(['field1', 'field2', 'field3']);
    });
  });

  describe('objectOmitFields()', () => {
    interface Example {
      readonly input: {
        readonly fieldsToOmit: readonly (keyof ObjectType)[];
      };
      readonly expected: AnyObject;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          fieldsToOmit: [],
        },
        expected: { field1: 'value1', field2: 'value2', field3: 3 },
      },
      {
        input: {
          fieldsToOmit: ['field1'],
        },
        expected: { field2: 'value2', field3: 3 },
      },
      {
        input: {
          fieldsToOmit: ['field1', 'field3'],
        },
        expected: { field2: 'value2' },
      },
      {
        input: {
          fieldsToOmit: ['field1', 'field2', 'field3'],
        },
        expected: {},
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = objectOmitFields(
          INPUT_OBJECT,
          example.input.fieldsToOmit
        );
        expect(INPUT_OBJECT).toEqual(COPY_OF_INPUT_OBJECT);
        expect(actual).toEqual(example.expected);
        for (const field of example.input.fieldsToOmit) {
          expect((actual as ObjectType)[field]).toBeUndefined();
          expect(Object.prototype.hasOwnProperty.call(actual, field)).toEqual(
            false
          );
        }
      });
    });
  });

  describe('objectPickFields()', () => {
    interface Example {
      readonly input: {
        readonly fieldsToPick: readonly (keyof ObjectType)[];
      };
      readonly expected: AnyObject;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          fieldsToPick: [],
        },
        expected: {},
      },
      {
        input: {
          fieldsToPick: ['field2'],
        },
        expected: { field2: 'value2' },
      },
      {
        input: {
          fieldsToPick: ['field2', 'field3'],
        },
        expected: { field2: 'value2', field3: 3 },
      },
      {
        input: {
          fieldsToPick: ['field1', 'field2', 'field3'],
        },
        expected: { field1: 'value1', field2: 'value2', field3: 3 },
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = objectPickFields(
          INPUT_OBJECT,
          example.input.fieldsToPick
        );
        expect(INPUT_OBJECT).toEqual(COPY_OF_INPUT_OBJECT);
        expect(actual).toEqual(example.expected);

        const fieldsToOmit = (
          Object.keys(INPUT_OBJECT) as (keyof ObjectType)[]
        ).filter((key) => !example.input.fieldsToPick.includes(key));

        for (const field of fieldsToOmit) {
          expect((actual as ObjectType)[field]).toBeUndefined();
          expect(Object.prototype.hasOwnProperty.call(actual, field)).toEqual(
            false
          );
        }
      });
    });
  });

  describe('objectPickAndConvertFields()', () => {
    interface Example {
      readonly input: {
        readonly fieldsToPick: readonly ConditionalKeys<ObjectType, string>[];
      };
      readonly expected: AnyObject;
    }

    interface ResultType {
      readonly value: string;
    }

    const VALUE_CONVERTER = (value: string): ResultType => ({ value });

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          fieldsToPick: [],
        },
        expected: {},
      },
      {
        input: {
          fieldsToPick: ['field2'],
        },
        expected: { field2: { value: 'value2' } },
      },
      {
        input: {
          fieldsToPick: ['field1', 'field2'],
        },
        expected: { field1: { value: 'value1' }, field2: { value: 'value2' } },
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = objectPickAndConvertFields(
          INPUT_OBJECT,
          example.input.fieldsToPick,
          VALUE_CONVERTER
        );
        expect(INPUT_OBJECT).toEqual(COPY_OF_INPUT_OBJECT);
        expect(actual).toEqual(example.expected);

        const fieldsToOmit = (Object.keys(INPUT_OBJECT) as AnyValue[]).filter(
          (key) => !example.input.fieldsToPick.includes(key)
        );

        for (const field of fieldsToOmit) {
          expect((actual as AnyValue)[field]).toBeUndefined();
          expect(Object.prototype.hasOwnProperty.call(actual, field)).toEqual(
            false
          );
        }
      });
    });
  });

  describe('objectRemoveUndefined()', () => {
    interface Example {
      readonly input: AnyObject;
      readonly expected: {
        result: AnyObject;
        nonExistingProperties: readonly string[];
      };
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {},
        expected: {
          result: {},
          nonExistingProperties: [],
        },
      },
      {
        input: { field1: 1 },
        expected: {
          result: { field1: 1 },
          nonExistingProperties: [],
        },
      },
      {
        input: { field1: undefined },
        expected: {
          result: {},
          nonExistingProperties: ['field1'],
        },
      },
      {
        input: { field1: 1, field2: undefined, field3: 3 },
        expected: {
          result: { field1: 1, field3: 3 },
          nonExistingProperties: ['field2'],
        },
      },
      {
        input: { field1: undefined, field2: 2, field3: undefined },
        expected: {
          result: { field2: 2 },
          nonExistingProperties: ['field1', 'field3'],
        },
      },

      {
        input: { field1: null, field2: 0, field3: '', field4: undefined },
        expected: {
          result: { field1: null, field2: 0, field3: '' },
          nonExistingProperties: ['field4'],
        },
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = objectRemoveUndefined(example.input);
        expect(actual).toEqual(example.expected.result);
        for (const property of example.expected.nonExistingProperties) {
          const hasProperty = Object.prototype.hasOwnProperty.call(
            actual,
            property
          );
          expect(hasProperty).toBe(false);
        }
      });
    });
  });
});
