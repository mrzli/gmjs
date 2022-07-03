import { SchemaToCliAppCodeInput } from './schema-to-cli-app-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { generateMainCode } from './impl/generate-main-code';
import { generateSeedDbCode } from './impl/generate-seed-db-code';

export function schemaToCliAppCode(
  input: SchemaToCliAppCodeInput
): readonly PathContentPair[] {
  const mainCode = generateMainCode(input);
  const seedDbCode = generateSeedDbCode(input);

  return [
    {
      path: 'main.ts',
      content: mainCode,
    },
    {
      path: 'app/mongo/seed-db.ts',
      content: seedDbCode,
    },
  ];
}
