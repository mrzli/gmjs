import { DatabaseService } from "@gmjs/db-util";
import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from "@nestjs/common";

export const INJECTION_TOKEN_DATABASE_SERVICE = 'INJECTION_TOKEN_DATABASE_SERVICE';

@Injectable()
export class DatabaseServiceWrapper implements OnModuleInit, OnModuleDestroy {
  public constructor(
    @Inject(INJECTION_TOKEN_DATABASE_SERVICE) private readonly databaseService: DatabaseService
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.databaseService.init();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.databaseService.destroy();
  }

  public getDatabaseService<T extends DatabaseService>(): T {
    return this.databaseService as T;
  }
}