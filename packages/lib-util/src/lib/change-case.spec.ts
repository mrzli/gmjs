import { casedNames, CasedNames } from '@gmjs/lib-util';

describe('change-case', () => {
  describe('casedNames()', () => {
    interface Example {
      readonly input: readonly string[];
      readonly expected: CasedNames;
    }

    const DEFAULT_RESULT: CasedNames = {
      pascalCased: 'SomeWordsHere',
      camelCased: 'someWordsHere',
      kebabCased: 'some-words-here',
    };

    const EXAMPLES: readonly Example[] = [
      {
        input: [],
        expected: {
          pascalCased: '',
          camelCased: '',
          kebabCased: '',
        },
      },
      {
        input: [''],
        expected: {
          pascalCased: '',
          camelCased: '',
          kebabCased: '',
        },
      },
      {
        input: ['a'],
        expected: {
          pascalCased: 'A',
          camelCased: 'a',
          kebabCased: 'a',
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

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = casedNames(...example.input);
        expect(actual).toEqual(example.expected);
      });
    });
  });
});
