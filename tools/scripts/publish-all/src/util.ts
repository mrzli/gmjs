import { execSync } from 'child_process';
import { logger, Tree } from '@nrwl/devkit';
import { FsTree } from 'nx/src/generators/tree';
import { ENCODING } from './constants';

export function createWorkspaceTree(): Tree {
  return new FsTree('.', false);
}

export function exec(command: string): string {
  return execSync(command).toString(ENCODING);
}

export function createFindByFileNameCommand(
  libsDir: string,
  fileName: string
): string {
  return ['find', `./${libsDir}`, '-type f', `-name ${fileName}`].join(' ');
}

export function findFilesResultToArray(
  findFilesResult: string
): readonly string[] {
  return findFilesResult
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !!line);
}

export function invariant(
  condition: boolean,
  message: string
): asserts condition {
  if (!condition) {
    logger.error(message);
    process.exit(1);
  }
}
