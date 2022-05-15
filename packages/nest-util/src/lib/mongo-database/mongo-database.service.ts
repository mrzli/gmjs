import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { PROVIDER_KEY_MONGO_DATABASE_CONFIG_OPTIONS } from './provider-keys';
import { MongoDatabaseConfigOptions } from './mongo-database-config-options';
import { getMongoServerConnectionString } from './mongo-database-utils';
import { valueOrThrow } from '../nest-util';

export interface MongoDatabaseServiceInterface
  extends OnModuleInit,
    OnModuleDestroy {
  get db(): Db;
}

const DATABASE_NOT_INITIALIZED_ERROR_MESSAGE = 'Database not initialized.';

@Injectable()
export class MongoDatabaseService implements MongoDatabaseServiceInterface {
  private _dbClient: MongoClient | undefined;
  private _db: Db | undefined;

  public constructor(
    @Inject(PROVIDER_KEY_MONGO_DATABASE_CONFIG_OPTIONS)
    private readonly configOptions: MongoDatabaseConfigOptions
  ) {}

  public async onModuleInit(): Promise<void> {
    const configOptions = this.configOptions;
    const connectionString = getMongoServerConnectionString(configOptions);
    const dbClient = await MongoClient.connect(connectionString);
    this._dbClient = dbClient;
    this._db = dbClient.db(configOptions.dbName);
  }

  public async onModuleDestroy(): Promise<void> {
    await this._dbClient?.close();
  }

  public get db(): Db {
    return valueOrThrow(this._db, DATABASE_NOT_INITIALIZED_ERROR_MESSAGE);
  }
}
