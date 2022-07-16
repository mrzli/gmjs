import { SchemaToCodeInterfacePrefixes } from './types';

const GMJS_NPM_SCOPE = 'gmjs';

export const MODULE_NAME_GMJS_UTIL = toGmjsModuleName('util');
export const MODULE_NAME_GMJS_MONGO_UTIL = toGmjsModuleName('mongo-util');
export const MODULE_NAME_GMJS_NEST_UTIL = toGmjsModuleName('nest-util');
export const MODULE_NAME_GMJS_LIB_UTIL = toGmjsModuleName('lib-util');

function toGmjsModuleName(projectName: string): string {
  return `@${GMJS_NPM_SCOPE}/${projectName}`;
}

export const DEFAULT_SCHEMA_TO_CODE_INTERFACE_PREFIXES: SchemaToCodeInterfacePrefixes =
  {
    db: 'db',
    app: '',
  };
