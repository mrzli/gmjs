import * as ts from 'typescript';
import { createVariableType } from './variable-type';
import { statementsToString } from '../../util/print';
import { createCodeFactory } from '../code-factory';
import { CodeNodeVariableType } from '../../types/variable-type';

const { factory: f } = ts;

describe('variable-type', () => {
  describe('createVariableType()', () => {
    interface Example {
      readonly input: CodeNodeVariableType;
      readonly expected: string;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: {
          type: 'keyword',
          keywordType: 'string',
        },
        expected: 'string',
      },
      {
        input: {
          type: 'keyword',
          keywordType: 'number',
        },
        expected: 'number',
      },
      {
        input: {
          type: 'reference',
          referenceType: 'ObjectId',
        },
        expected: 'ObjectId',
      },
      {
        input: {
          type: 'literal-string',
          literal: 'some-literal',
        },
        expected: "'some-literal'",
      },
      {
        input: {
          type: 'literal-number',
          literal: '11.2',
        },
        expected: '11.2',
      },
      {
        input: {
          type: 'literal-null-true-false',
          literal: null,
        },
        expected: 'null',
      },
      {
        input: {
          type: 'literal-null-true-false',
          literal: true,
        },
        expected: 'true',
      },
      {
        input: {
          type: 'literal-null-true-false',
          literal: false,
        },
        expected: 'false',
      },
      {
        input: {
          type: 'literal-object',
          members: [
            {
              name: 'field1',
              variableType: { type: 'keyword', keywordType: 'string' },
              isReadonly: true,
              isOptional: false,
            },
            {
              name: 'field2',
              variableType: { type: 'keyword', keywordType: 'number' },
              isReadonly: false,
              isOptional: true,
            },
          ],
        },
        expected: '{\n    readonly field1: string;\n    field2?: number;\n}',
      },
      {
        input: {
          type: 'generic',
          referenceType: 'MainType',
          genericTypes: [{ type: 'keyword', keywordType: 'string' }],
        },
        expected: 'MainType<string>',
      },
      {
        input: {
          type: 'generic',
          referenceType: 'MainType',
          genericTypes: [
            {
              type: 'keyword',
              keywordType: 'string',
            },
            { type: 'keyword', keywordType: 'number' },
          ],
        },
        expected: 'MainType<string, number>',
      },
      {
        input: {
          type: 'generic',
          referenceType: 'MainType',
          genericTypes: [
            {
              type: 'generic',
              referenceType: 'SubType',
              genericTypes: [
                {
                  type: 'keyword',
                  keywordType: 'string',
                },
              ],
            },
            { type: 'keyword', keywordType: 'number' },
          ],
        },
        expected: 'MainType<SubType<string>, number>',
      },
      {
        input: {
          type: 'union',
          unionTypes: [
            {
              type: 'keyword',
              keywordType: 'string',
            },
            { type: 'keyword', keywordType: 'number' },
          ],
        },
        expected: 'string | number',
      },
      {
        input: {
          type: 'union',
          unionTypes: [
            {
              type: 'array',
              itemType: {
                type: 'keyword',
                keywordType: 'string',
              },
            },
            {
              type: 'array',
              itemType: {
                type: 'keyword',
                keywordType: 'number',
              },
            },
          ],
        },
        expected: 'readonly string[] | readonly number[]',
      },
      {
        input: {
          type: 'array',
          itemType: {
            type: 'keyword',
            keywordType: 'string',
          },
        },
        expected: 'readonly string[]',
      },
      {
        input: {
          type: 'array',
          itemType: {
            type: 'literal-object',
            members: [
              {
                name: 'field',
                variableType: { type: 'keyword', keywordType: 'string' },
                isReadonly: true,
                isOptional: false,
              },
            ],
          },
        },
        expected: 'readonly {\n    readonly field: string;\n}[]',
      },
      {
        input: {
          type: 'array',
          itemType: {
            type: 'union',
            unionTypes: [
              { type: 'keyword', keywordType: 'string' },
              { type: 'keyword', keywordType: 'number' },
            ],
          },
        },
        expected: 'readonly (string | number)[]',
      },
      {
        input: {
          type: 'array',
          itemType: {
            type: 'array',
            itemType: {
              type: 'keyword',
              keywordType: 'string',
            },
          },
        },
        expected: 'readonly (readonly string[])[]',
      },
    ];

    const cf = createCodeFactory(f, { singleQuotes: true });

    EXAMPLES.forEach((example) => {
      it(JSON.stringify(example), () => {
        const actual = variableTypeDeclarationToString(
          f,
          createVariableType(cf, example.input)
        );
        expect(actual).toEqual(example.expected);
      });
    });
  });
});

function variableTypeDeclarationToString(
  f: ts.NodeFactory,
  variableDeclaration: ts.TypeNode
): string {
  const statementString = statementsToString(f, [
    createVariableStatement(f, variableDeclaration),
  ]);

  return statementString.substring(7, statementString.length - 2);
}

function createVariableStatement(
  f: ts.NodeFactory,
  variableDeclaration: ts.TypeNode
): ts.Statement {
  return f.createVariableStatement(
    undefined,
    f.createVariableDeclarationList(
      [
        f.createVariableDeclaration(
          f.createIdentifier('x'),
          undefined,
          variableDeclaration,
          undefined
        ),
      ],
      ts.NodeFlags.Let
    )
  );
}
