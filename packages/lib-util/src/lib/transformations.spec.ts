import { jsonToPretty, jsonToText, textToJson } from './transformations';

describe('transformations', () => {
  describe('textToJson()', () => {
    interface Example {
      readonly input: string;
      readonly expected: unknown;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: 'null',
        expected: null,
      },
      {
        input: '"string value"',
        expected: 'string value',
      },
      {
        input: '1',
        expected: 1,
      },
      {
        input: 'true',
        expected: true,
      },
      {
        input: '{}',
        expected: {},
      },
      {
        input: '{"field":"value"}',
        expected: { field: 'value' },
      },
      {
        input: '[]',
        expected: [],
      },
      {
        input: '[1,3]',
        expected: [1, 3],
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = textToJson(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('jsonToText()', () => {
    interface Example {
      readonly input: unknown;
      readonly expected: string;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: null,
        expected: 'null',
      },
      {
        input: 'string value',
        expected: '"string value"',
      },
      {
        input: 1,
        expected: '1',
      },
      {
        input: true,
        expected: 'true',
      },
      {
        input: {},
        expected: '{}',
      },
      {
        input: { field: 'value' },
        expected: '{"field":"value"}',
      },
      {
        input: [],
        expected: '[]',
      },
      {
        input: [1, 3],
        expected: '[1,3]',
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = jsonToText(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });

  describe('jsonToPretty()', () => {
    interface Example {
      readonly input: unknown;
      readonly expected: string;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: null,
        expected: 'null\n',
      },
      {
        input: 'string value',
        expected: '"string value"\n',
      },
      {
        input: 1,
        expected: '1\n',
      },
      {
        input: true,
        expected: 'true\n',
      },
      {
        input: {},
        expected: '{}\n',
      },
      {
        input: { field: 'value' },
        expected: '{\n  "field": "value"\n}\n',
      },
      {
        input: [],
        expected: '[]\n',
      },
      {
        input: [1, 3],
        expected: '[\n  1,\n  3\n]\n',
      },
    ];

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = jsonToPretty(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
