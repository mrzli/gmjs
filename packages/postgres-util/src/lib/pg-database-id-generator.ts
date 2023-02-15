import { DatabaseIdGenerator } from '@gmjs/db-util';
import { mapGetOrThrow } from '@gmjs/util';

export class PgDatabaseIdGenerator implements DatabaseIdGenerator {
  private readonly lastIdMap = new Map<string, number>();

  public generateId(modelName: string): string {
    if (!this.lastIdMap.has(modelName)) {
      this.lastIdMap.set(modelName, 1);
      return '1';
    }

    const lastId = mapGetOrThrow(this.lastIdMap, modelName);
    const nextId = lastId + 1;
    this.lastIdMap.set(modelName, nextId);

    return nextId.toString();
  }
}
