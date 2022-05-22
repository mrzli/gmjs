import { GenerateMongoCodeFromSchemaOptions } from './types';
import * as path from 'path';

export class PathResolver {
  private readonly rootDir: string;

  public constructor(
    private readonly options: GenerateMongoCodeFromSchemaOptions
  ) {
    this.rootDir = path.resolve(process.cwd(), options.rootDir);
  }

  public resolveSharedProjectDir(): string {
    const { appsMonorepo } = this.options;
    return path.resolve(
      this.rootDir,
      appsMonorepo.libsDir,
      appsMonorepo.sharedProject.projectDir
    );
  }

  public resolveSharedProjectIndexFile(): string {
    return path.resolve(
      this.resolveSharedProjectDir(),
      this.options.appsMonorepo.sharedProject.indexFilePath
    );
  }

  public resolveSharedProjectInterfacesRootDir(): string {
    return path.resolve(
      this.resolveSharedProjectDir(),
      this.options.appsMonorepo.sharedProject.sharedInterfacesDir
    );
  }
}
