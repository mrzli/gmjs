import { DatabaseIdGenerator } from '@gmjs/db-util';
import { generateObjectIdStr } from './mongo-util';

export class MongoDatabaseIdGenerator implements DatabaseIdGenerator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public generateId(modelName: string): string {
    return generateObjectIdStr();
  }
}
