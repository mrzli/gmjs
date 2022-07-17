import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import { CodeGenerationInterfacePrefixes } from '../shared/types';

export interface SchemaToSharedLibraryCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly initialFiles: SchemaToSharedLibraryCodeInitialFiles;
  readonly options: SchemaToSharedLibraryCodeOptions;
}

export interface SchemaToSharedLibraryCodeInitialFiles {
  readonly index: string;
}

export interface SchemaToSharedLibraryCodeOptions {
  readonly interfacePrefixes: CodeGenerationInterfacePrefixes;
}
