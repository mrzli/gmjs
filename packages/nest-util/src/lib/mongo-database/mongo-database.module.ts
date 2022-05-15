import { DynamicModule, Global, Module } from '@nestjs/common';
import { MongoDatabaseService } from './mongo-database.service';
import { PROVIDER_KEY_MONGO_DATABASE_CONFIG_OPTIONS } from './provider-keys';
import { MongoDatabaseConfigOptions } from './mongo-database-config-options';

@Global()
@Module({})
export class MongoDatabaseModule {
  public static register(
    configOptions: MongoDatabaseConfigOptions
  ): DynamicModule {
    return {
      module: MongoDatabaseModule,
      imports: [],
      providers: [
        {
          provide: PROVIDER_KEY_MONGO_DATABASE_CONFIG_OPTIONS,
          useValue: configOptions,
        },
        MongoDatabaseService,
      ],
      exports: [MongoDatabaseService],
    };
  }
}
