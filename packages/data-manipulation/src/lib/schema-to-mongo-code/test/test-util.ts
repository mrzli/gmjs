import { SchemaToMongoCodeOptions } from '../input-types';

export const TEST_FILE_SUFFIX = '_';

export const TEST_OPTIONS: SchemaToMongoCodeOptions = {
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
      prefix: 'app',
    },
    sharedProject: {
      projectName: 'example-shared',
      sharedInterfacesDir: 'src/lib/mongo',
      indexFilePath: 'src/index.ts',
    },
    appProject: {
      projectName: 'example-be',
      appDir: 'src/app',
    },
  },
};

export function createTestOptions(rootDir: string): SchemaToMongoCodeOptions {
  return { ...TEST_OPTIONS, rootDir };
}
