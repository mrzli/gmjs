export interface CodeGenerationInterfacePrefixes {
  readonly db: string;
  readonly app: string;
}

export interface CodeGenerationAppsMonorepoOptions {
  readonly npmScope: string;
  readonly libsDir: string;
  readonly baseProjectName: string;
}

export interface CodeGenerationLibsModuleNames {
  readonly util: string;
  readonly mongoUtil: string;
  readonly nestUtil: string;
  readonly libUtil: string;
  readonly browserUtil: string;
  readonly reactUtil: string;
}
