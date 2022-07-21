import {
  camelCaseJoined,
  capitalCaseJoined,
  CasedNames,
  casedNames,
  constantCaseJoined,
  kebabCaseJoined,
  pascalCaseJoined,
} from './change-case';

describe('change-case', () => {
  interface Example {
    readonly input: readonly string[];
    readonly expected: Expected;
  }

  interface Expected {
    readonly pascalCased: string;
    readonly camelCased: string;
    readonly kebabCased: string;
    readonly constantCased: string;
    readonly capitalCased: string;
  }

  const DEFAULT_RESULT: Expected = {
    pascalCased: 'SomeWordsHere',
    camelCased: 'someWordsHere',
    kebabCased: 'some-words-here',
    constantCased: 'SOME_WORDS_HERE',
    capitalCased: 'Some Words Here',
  };

  const EXAMPLES: readonly Example[] = [
    {
      input: [],
      expected: {
        pascalCased: '',
        camelCased: '',
        kebabCased: '',
        constantCased: '',
        capitalCased: '',
      },
    },
    {
      input: [''],
      expected: {
        pascalCased: '',
        camelCased: '',
        kebabCased: '',
        constantCased: '',
        capitalCased: '',
      },
    },
    {
      input: ['a'],
      expected: {
        pascalCased: 'A',
        camelCased: 'a',
        kebabCased: 'a',
        constantCased: 'A',
        capitalCased: 'A',
      },
    },
    {
      input: ['someWordsHere'],
      expected: DEFAULT_RESULT,
    },
    {
      input: ['some words here'],
      expected: DEFAULT_RESULT,
    },
    {
      input: ['someWords here'],
      expected: DEFAULT_RESULT,
    },
    {
      input: ['some-words here'],
      expected: DEFAULT_RESULT,
    },
    {
      input: ['some_words here'],
      expected: DEFAULT_RESULT,
    },
    {
      input: ['someWords', 'here'],
      expected: DEFAULT_RESULT,
    },
  ];

  describe('pascalCaseJoined()', () => {
    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = pascalCaseJoined(...example.input);
        expect(actual).toEqual(example.expected.pascalCased);
      });
    });
  });

  describe('camelCaseJoined()', () => {
    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = camelCaseJoined(...example.input);
        expect(actual).toEqual(example.expected.camelCased);
      });
    });
  });

  describe('kebabCaseJoined()', () => {
    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = kebabCaseJoined(...example.input);
        expect(actual).toEqual(example.expected.kebabCased);
      });
    });
  });

  describe('constantCaseJoined()', () => {
    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = constantCaseJoined(...example.input);
        expect(actual).toEqual(example.expected.constantCased);
      });
    });
  });

  describe('capitalCaseJoined()', () => {
    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = capitalCaseJoined(...example.input);
        expect(actual).toEqual(example.expected.capitalCased);
      });
    });
  });

  describe('casedNames()', () => {
    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = casedNames(...example.input);
        const expected: CasedNames = {
          pascalCased: example.expected.pascalCased,
          camelCased: example.expected.camelCased,
          kebabCased: example.expected.kebabCased,
          constantCased: example.expected.constantCased,
        };
        expect(actual).toEqual(expected);
      });
    });
  });
});
