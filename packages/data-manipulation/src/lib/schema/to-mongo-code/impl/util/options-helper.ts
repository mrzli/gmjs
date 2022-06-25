import { SchemaToMongoCodeOptions } from '../../schema-to-mongo-code-input';
import path from 'path';

export class OptionsHelper {
  private readonly rootDir: string;

  public constructor(private readonly options: SchemaToMongoCodeOptions) {
    this.rootDir = path.resolve(process.cwd(), options.rootDir);
  }

  public resolveSharedProjectDir(): string {
    const { appsMonorepo } = this.options;
    return path.resolve(
      this.rootDir,
      appsMonorepo.libsDir,
      appsMonorepo.sharedProject.projectName
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

  public resolveAppProjectDir(): string {
    const { appsMonorepo } = this.options;
    return path.resolve(
      this.rootDir,
      appsMonorepo.appsDir,
      appsMonorepo.appProject.projectName
    );
  }

  public resolveAppProjectAppDir(): string {
    return path.join(
      this.resolveAppProjectDir(),
      this.options.appsMonorepo.appProject.appDir
    );
  }

  public resolveAppProjectAppModuleFile(): string {
    return path.join(this.resolveAppProjectAppDir(), 'app.module.ts');
  }

  public getDbInterfacePrefix(): string {
    return this.options.appsMonorepo.dbInterfaceOptions.prefix;
  }

  public getAppInterfacePrefix(): string {
    return this.options.appsMonorepo.appInterfaceOptions.prefix;
  }

  public getSharedLibraryModuleSpecifier(): string {
    const appsMonorepo = this.options.appsMonorepo;
    return `@${appsMonorepo.npmScope}/${appsMonorepo.sharedProject.projectName}`;
  }

  public getNestUtilModuleSpecifier(): string {
    const libsMonorepo = this.options.libsMonorepoNames;
    return `@${libsMonorepo.npmScope}/${libsMonorepo.nestUtilProjectName}`;
  }

  public getUtilModuleSpecifier(): string {
    const libsMonorepo = this.options.libsMonorepoNames;
    return `@${libsMonorepo.npmScope}/${libsMonorepo.utilProjectName}`;
  }
}