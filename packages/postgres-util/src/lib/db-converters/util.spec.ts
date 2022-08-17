import { quoteValue } from './util'

describe('util', () => {
  describe('quoteValue()', () => {
    interface Example {
      readonly input: string;
      readonly expected: string;
    }
  
    const EXAMPLES: readonly Example[] = [
      {
        input: '',
        expected: "''",
      },
      {
        input: 'simple text',
        expected: "'simple text'",
      },
      {
        input: "what's life",
        expected: "'what''s life'",
      },
      {
        input: "multiple single quotes - here is one ' - here are two more ''",
        expected: "'multiple single quotes - here is one '' - here are two more '''''",
      },
    ];
  
    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = quoteValue(example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });
});