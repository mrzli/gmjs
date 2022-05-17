import * as path from 'path';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import { ReadonlyRecord } from '@gmjs/util';
import * as klawSync from 'klaw-sync';

const ENCODING = 'utf-8';

export interface TestFileSystemExample {
  readonly dir: string;
  readonly files: ReadonlyRecord<string, string>;
}

export function getFileSystemTestExamples(
  examplesRootDir: string
): readonly TestFileSystemExample[] {
  const exampleDirs = klawSync(examplesRootDir, {
    nofile: true,
    depthLimit: 0,
  });

  return exampleDirs.map((d) => {
    const dir = path.basename(d.path);
    const files = readFilesFromExamplesDir(d.path);
    return {
      dir,
      files,
    };
  });
}

function readFilesFromExamplesDir(
  exampleDir: string
): ReadonlyRecord<string, string> {
  const files = klawSync(exampleDir, { nodir: true, depthLimit: 0 });
  return files.reduce((acc, f) => {
    const fileName = path.basename(f.path);
    const content = fs.readFileSync(f.path, ENCODING);
    return { ...acc, [fileName]: content };
  }, {});
}
