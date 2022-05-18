import * as fs from 'fs-extra';

export interface FileSystemFindInfo {
  readonly fullPath: string;
  readonly stats: fs.Stats;
}

export type FileSystemFindFsType = 'f' | 'd' | 'a';

export const FILE_SYSTEM_FIND_DEFAULT_FS_TYPE = 'a';

export interface FileSystemFindOptions {
  readonly fsType?: 'f' | 'd' | 'a';
}

export const FILE_SYSTEM_FIND_DEFAULT_OPTIONS: Required<FileSystemFindOptions> =
  {
    fsType: FILE_SYSTEM_FIND_DEFAULT_FS_TYPE,
  };
