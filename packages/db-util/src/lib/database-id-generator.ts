export interface DatabaseIdGenerator {
  readonly generateId: (modelName: string) => string;
}
