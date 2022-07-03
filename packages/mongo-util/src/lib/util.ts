import { MongoJsonSchemaTypeObject } from './mongo-json-schema/mongo-json-schema';
import { textToJson } from '@gmjs/lib-util';
import { readTextsByExtensionSync } from '@gmjs/fs-util';

export function getSchemasFromDir(
  dirPath: string
): readonly MongoJsonSchemaTypeObject[] {
  return readTextsByExtensionSync(dirPath, 'json').map((f) =>
    textToJson<MongoJsonSchemaTypeObject>(f.content)
  );
}
