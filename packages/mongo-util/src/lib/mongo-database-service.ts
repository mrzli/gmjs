import { Db, MongoClient } from 'mongodb';
import { invariant } from '@gmjs/util';
import { DatabaseService } from '@gmjs/db-util';
import { Except } from 'type-fest';

export interface MongoDatabaseInputParams {
  readonly host: string;
  readonly port: number;
  readonly dbName: string;
}

export class MongoDatabaseService implements DatabaseService {
  private _dbClient: MongoClient | undefined;
  private _db: Db | undefined;

  public constructor(private readonly params: MongoDatabaseInputParams) {}

  public async init(): Promise<void> {
    const params = this.params;
    const connectionString = getMongoServerConnectionString(params);
    const dbClient = await MongoClient.connect(connectionString);
    this._dbClient = dbClient;
    this._db = dbClient.db(params.dbName);
  }

  public async destroy(): Promise<void> {
    await this._dbClient?.close();
  }

  public get db(): Db {
    invariant(!!this._db, 'Database not initialized.');
    return this._db;
  }
}

function getMongoServerConnectionString(
  configOptions: Except<MongoDatabaseInputParams, 'dbName'>
): string {
  return `mongodb://${configOptions.host}:${configOptions.port}`;
}

// function getMongoDatabaseConnectionString(
//   configOptions: MongoDatabaseInputParams
// ): string {
//   return `${getMongoServerConnectionString(configOptions)}/${
//     configOptions.dbName
//   }`;
// }
