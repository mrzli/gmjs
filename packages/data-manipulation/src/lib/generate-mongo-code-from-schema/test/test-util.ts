import { GenerateMongoCodeFromSchemaOptions } from '../util/types';

export const TEST_FILE_SUFFIX = '_';

export const TEST_OPTIONS: GenerateMongoCodeFromSchemaOptions = {
  rootDir: '/root-dir',
  isTest: true,
  libsMonorepoNames: {
    npmScope: 'gmjs',
    utilProjectName: 'util',
    nestUtilProjectName: 'nest-util',
  },
  appsMonorepo: {
    npmScope: 'gmjs-apps',
    libsDir: 'libs',
    appsDir: 'apps',
    dbInterfaceOptions: {
      dir: 'db',
      prefix: 'db',
    },
    appInterfaceOptions: {
      dir: 'app',
      prefix: '',
    },
    sharedProject: {
      projectDir: 'example-shared',
      sharedInterfacesDir: 'src/lib/mongo',
      indexFilePath: 'src/index.ts',
    },
    appProject: {
      projectDir: 'example-be',
      appDir: 'src/app',
    },
  },
};

export function createTestOptions(
  rootDir: string
): GenerateMongoCodeFromSchemaOptions {
  return { ...TEST_OPTIONS, rootDir };
}