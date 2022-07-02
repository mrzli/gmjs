import {
  MongoJsonSchemaPropertyContext,
  MongoJsonSchemaVisitor,
  mongoSchemaVisit,
} from './mongo-schema-visit';
import {
  MongoJsonSchemaAnyType,
  MongoJsonSchemaTypeObject,
} from '../mongo-json-schema';
import path from 'path';
import {
  createFileSystemExampleTest,
  ExampleMappingFn,
  getFileSystemTestExamples,
} from '@gmjs/test-util';
import { textToJson } from '@gmjs/lib-util';

describe('mongo-schema-visit', () => {
  describe('mongoSchemaVisit()', () => {
    interface TestInput {
      readonly schema: MongoJsonSchemaTypeObject;
    }

    const exampleMapping: ExampleMappingFn<TestInput> = (te) => {
      return {
        description: te.dir,
        input: {
          schema: textToJson<MongoJsonSchemaTypeObject>(te.files['input.json']),
        },
        expected: te.files['result.txt'],
      };
    };

    const VISITOR: MongoJsonSchemaVisitor<string[]> = (
      schema: MongoJsonSchemaAnyType,
      propertyContext: MongoJsonSchemaPropertyContext | undefined,
      parameter: string[] | undefined
    ) => {
      const propertyContextValues: readonly string[] = propertyContext
        ? [
            propertyContext.propertyName,
            propertyContext.propertyIndex.toString(),
            propertyContext.totalNumPropertiesInObject.toString(),
          ]
        : [];
      const schemaString: string = [
        schema.bsonType,
        ...propertyContextValues,
      ].join(', ');
      parameter?.push(schemaString);
    };

    const EXAMPLES = getFileSystemTestExamples<TestInput>(
      path.join(__dirname, 'test-assets'),
      exampleMapping
    );

    EXAMPLES.forEach((example) => {
      it(
        example.description,
        createFileSystemExampleTest(
          example,
          () => {
            const result: string[] = [];
            mongoSchemaVisit(example.input.schema, VISITOR, result);
            return result;
          },
          (result: string[]) => {
            return result.join('\n') + '\n';
          }
        )
      );
    });
  });
});
