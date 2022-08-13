export interface DatabaseService {
  readonly init: () => Promise<void>;
  readonly destroy: () => Promise<void>;
}
