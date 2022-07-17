import {
  CodeGenerationInterfacePrefixes,
  CodeGenerationLibsModuleNames,
} from './types';

export const DEFAULT_CODE_GENERATION_INTERFACE_PREFIXES: CodeGenerationInterfacePrefixes =
  {
    db: 'db',
    app: '',
  };

export const DEFAULT_CODE_GENERATION_LIB_MODULE_NAMES: CodeGenerationLibsModuleNames =
  {
    util: toGmjsModuleName('util'),
    mongoUtil: toGmjsModuleName('mongo-util'),
    nestUtil: toGmjsModuleName('nest-util'),
    libUtil: toGmjsModuleName('lib-util'),
    browserUtil: toGmjsModuleName('browser-util'),
    reactUtil: toGmjsModuleName('react-util'),
  };

function toGmjsModuleName(projectName: string): string {
  return `@gmjs/${projectName}`;
}
