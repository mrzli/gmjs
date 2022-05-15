import { Except } from 'type-fest';
import { MongoDatabaseConfigOptions } from './mongo-database-config-options';

export function getMongoServerConnectionString(
  configOptions: Except<MongoDatabaseConfigOptions, 'dbName'>
): string {
  return `mongodb://${configOptions.host}:${configOptions.port}`;
}

export function getMongoDatabaseConnectionString(
  configOptions: MongoDatabaseConfigOptions
): string {
  return `${getMongoServerConnectionString(configOptions)}/${
    configOptions.dbName
  }`;
}
