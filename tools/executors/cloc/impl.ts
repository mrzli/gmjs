import type { ExecutorContext } from '@nrwl/devkit';
import * as child_process from 'child_process';
import { join } from 'path';
import { promisify } from 'util';

export interface ClocExecutorOptions {}

const exec = promisify(child_process.exec);

export default async function clocExecutor(
  _options: ClocExecutorOptions,
  _context: ExecutorContext
): Promise<{ success: boolean }> {
  const clocDir = 'tools/executors/cloc';
  const clocConfigDir = join(clocDir, 'config');

  const { stdout, stderr } = await exec(
    `npx cloc --exclude-dir=$(tr '\n' ',' < ${clocConfigDir}/.clocignore.d) --exclude-list-file=${clocConfigDir}/.clocignore.f .`
  );

  console.log(stdout);
  if (stderr.length > 0) {
    console.error(stderr);
  }

  const success = !stderr;
  return { success };
}
