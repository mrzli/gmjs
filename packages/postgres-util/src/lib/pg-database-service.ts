import { DatabaseService } from '@gmjs/db-util';
import { Client } from 'pg';
import { PgDatabaseInputParams } from './types';

export class PgDatabaseService implements DatabaseService {
  private readonly _dbClient: Client;

  public constructor(params: PgDatabaseInputParams) {
    this._dbClient = new Client({
      host: params.host,
      port: params.port,
      database: params.database,
      user: params.username,
      password: params.password,
    });
  }

  public async init(): Promise<void> {
    await this._dbClient.connect();
  }

  public async destroy(): Promise<void> {
    await this._dbClient.end();
  }

  public get client(): Client {
    return this._dbClient;
  }
}
