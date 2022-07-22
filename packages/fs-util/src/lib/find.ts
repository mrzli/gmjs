import klawSync from 'klaw-sync';
import {
  FILE_SYSTEM_FIND_DEFAULT_OPTIONS,
  FileSystemFindFsType,
  FileSystemFindInfo,
  FileSystemFindOptions,
} from './find-types';

export function findDirsShallowSync(
  rootDir: string
): readonly FileSystemFindInfo[] {
  return findFsEntriesSync(rootDir, { fsType: 'd', deep: false });
}

export function findFilesShallowSync(
  rootDir: string
): readonly FileSystemFindInfo[] {
  return findFsEntriesSync(rootDir, { fsType: 'f', deep: false });
}

export function findDirsDeepSync(
  rootDir: string
): readonly FileSystemFindInfo[] {
  return findFsEntriesSync(rootDir, { fsType: 'd', deep: true });
}

export function findFilesDeepSync(
  rootDir: string
): readonly FileSystemFindInfo[] {
  return findFsEntriesSync(rootDir, { fsType: 'f', deep: true });
}

export function findFsEntriesSync(
  rootDir: string,
  options?: FileSystemFindOptions
): readonly FileSystemFindInfo[] {
  return klawSync(rootDir, toKlawSyncOptions(options)).map(
    klawSyncItemToFileSystemSearchInfo
  );
}

function klawSyncItemToFileSystemSearchInfo(
  item: klawSync.Item
): FileSystemFindInfo {
  return { fullPath: item.path, stats: item.stats };
}

function toKlawSyncOptions(options?: FileSystemFindOptions): klawSync.Options {
  const finalOptions: Required<FileSystemFindOptions> = {
    ...FILE_SYSTEM_FIND_DEFAULT_OPTIONS,
    ...(options ?? {}),
  };

  return {
    depthLimit: finalOptions.deep ? -1 : 0,
    ...toKlawSyncFsType(finalOptions.fsType),
  };
}

function toKlawSyncFsType(
  fsType: FileSystemFindFsType
): Partial<klawSync.Options> {
  switch (fsType) {
    case 'f':
      return { nodir: true };
    case 'd':
      return { nofile: true };
    case 'a':
      return {};
  }
}
