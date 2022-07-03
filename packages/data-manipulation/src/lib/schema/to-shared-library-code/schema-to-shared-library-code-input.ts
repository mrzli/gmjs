import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';

export interface SchemaToSharedLibraryCodeInput {
  readonly schemas: readonly MongoJsonSchemaTypeObject[];
  readonly initialFiles: SchemaToSharedLibraryCodeInitialFiles;
  readonly options: SchemaToSharedLibraryCodeOptions;
}

export interface SchemaToSharedLibraryCodeInitialFiles {
  readonly index: string;
}

export interface SchemaToSharedLibraryCodeOptions {
  readonly mongoInterfacesDir: string;
  readonly dbInterfaceOptions: SchemaToSharedLibraryCodeInterfaceOptions;
  readonly appInterfaceOptions: SchemaToSharedLibraryCodeInterfaceOptions;
}

export interface SchemaToSharedLibraryCodeInterfaceOptions {
  readonly dir: string;
  readonly prefix: string;
}
