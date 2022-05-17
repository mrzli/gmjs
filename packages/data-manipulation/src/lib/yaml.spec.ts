import * as path from 'path';
import {
  getFileSystemTestExamples,
  toTestJsonFileContent,
} from '@gmjs/test-util';
import { parseYaml } from './yaml';

describe('yaml', () => {
  describe('parseYaml()', () => {
    interface ParseYamlExample {
      readonly description: string;
      readonly yaml: string;
      readonly jsonSchema?: any;
      readonly result?: string;
    }

    function getParseYamlExamples(): readonly ParseYamlExample[] {
      const examplesRootDir = path.join(__dirname, 'test-assets', 'parse-yaml');
      const testExamples = getFileSystemTestExamples(examplesRootDir);

      return testExamples.map((te) => {
        const schemaFile = te.files['schema.json'];
        return {
          description: te.dir,
          yaml: te.files['input.yaml'],
          jsonSchema: schemaFile ? JSON.parse(schemaFile) : undefined,
          result: te.files['result.json'],
        };
      });
    }

    const PARSE_YAML_EXAMPLES = getParseYamlExamples();

    PARSE_YAML_EXAMPLES.forEach((example) => {
      it(JSON.stringify(example.description), () => {
        if (example.result) {
          const actual = toTestJsonFileContent(
            parseYaml(example.yaml, { jsonSchema: example.jsonSchema })
          );
          expect(actual).toEqual(example.result);
        } else {
          expect(() =>
            parseYaml(example.yaml, { jsonSchema: example.jsonSchema })
          ).toThrow();
        }
      });
    });
  });
});
