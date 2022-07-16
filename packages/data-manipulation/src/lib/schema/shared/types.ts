export interface SchemaToCodeInterfacePrefixes {
  readonly db: string;
  readonly app: string;
}

export interface SchemaToCodeAppsMonorepoOptions {
  readonly npmScope: string;
  readonly libsDir: string;
  readonly baseProjectName: string;
}
