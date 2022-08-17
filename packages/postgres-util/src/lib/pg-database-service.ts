import { DatabaseService } from '@gmjs/db-util';
import { Client } from 'pg';
import { PgDatabaseInputParams } from './types';

export class PgDatabaseService implements DatabaseService {
  private _dbClient: Client;

  public constructor(params: PgDatabaseInputParams) {
    this._dbClient = new Client(params);
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
