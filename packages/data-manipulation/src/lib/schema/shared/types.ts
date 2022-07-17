export interface CodeGenerationInterfacePrefixes {
  readonly db: string;
  readonly app: string;
}

export interface CodeGenerationAppsMonorepoOptions {
  readonly npmScope: string;
  readonly libsDir: string;
  readonly baseProjectName: string;
}
