export interface PathContentPair {
  readonly path: string;
  readonly content: string;
}

export type FileSelectionPredicate = (filePath: string) => boolean;
