import { toTestJsonFileContent } from './json';

describe('json', () => {
  describe('toTestJsonFileContent()', () => {
    interface Example {
      readonly input: any;
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
        const actual = toTestJsonFileContent(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
